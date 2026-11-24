#!/usr/bin/env node
// Runs a severity prompt against a labelled set and scores it.
//
//   node src/run-eval.mjs --set tuning --prompt prompts/classify-v1.md
//   node src/run-eval.mjs --set holdout --prompt prompts/classify-v2.md --final
//
// Reports are fetched from GitHub at run time (issue body only: the report as filed,
// before any discussion). The grader is Claude, called through the Claude Code CLI.

import { createHash } from 'crypto';
import { execFile } from 'child_process';
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { promisify } from 'util';

const run = promisify(execFile);
const LABELS = ['critical', 'major', 'medium', 'minor', 'not_a_bug'];

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, arg, i, all) => {
    if (arg.startsWith('--')) pairs.push([arg.slice(2), all[i + 1]?.startsWith('--') || all[i + 1] === undefined ? true : all[i + 1]]);
    return pairs;
  }, []),
);
const set = args.set ?? 'tuning';
const promptPath = args.prompt ?? 'prompts/classify-v1.md';
const concurrency = Number(args.concurrency ?? 2);

const dataPath = `data/${set}.jsonl`;
const raw = readFileSync(dataPath, 'utf8');

// The holdout is frozen. Its hash is checked on every run, and each look at it is logged,
// so it can't quietly become a second tuning set.
if (set === 'holdout') {
  const expected = readFileSync('data/holdout.sha256', 'utf8').trim();
  const actual = createHash('sha256').update(raw).digest('hex');
  if (actual !== expected) throw new Error('Holdout file changed since it was frozen. Restore it, or freeze a new holdout.');
  if (!args.final) throw new Error('The holdout is for final measurement only. Re-run with --final once tuning is done.');
}

const cases = raw.trim().split('\n').map((line) => JSON.parse(line));
const template = readFileSync(promptPath, 'utf8').replace('{{RUBRIC}}', readFileSync('rubric.md', 'utf8'));

async function fetchReport(url) {
  const [, repo, number] = url.match(/github\.com\/([^/]+\/[^/]+)\/issues\/(\d+)/);
  const { stdout } = await run('gh', ['issue', 'view', number, '-R', repo, '--json', 'title,body']);
  const { title, body } = JSON.parse(stdout);
  return `Title: ${title}\n\n${body}`.slice(0, 6000);
}

async function grade(item) {
  const report = await fetchReport(item.url);
  const prompt = template.replace('{{REPORT}}', report);
  const { stdout } = await run(process.env.CLAUDE_BIN ?? 'claude', ['-p', prompt, '--output-format', 'json', '--max-turns', '1'], {
    maxBuffer: 10 * 1024 * 1024,
    timeout: 180_000,
  });
  const text = JSON.parse(stdout).result ?? '';
  const match = text.match(/\{[\s\S]*\}/);
  const answer = match ? JSON.parse(match[0]) : { severity: 'unparsed', reason: text.slice(0, 200) };
  return { ...item, predicted: answer.severity, reason: answer.reason };
}

async function mapLimited(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (next < items.length) {
        const index = next++;
        try {
          results[index] = await fn(items[index]);
        } catch (error) {
          results[index] = { ...items[index], predicted: 'error', reason: String(error.message).slice(0, 200) };
        }
        process.stdout.write(results[index].predicted === results[index].label ? '.' : 'x');
      }
    }),
  );
  process.stdout.write('\n');
  return results;
}

const results = await mapLimited(cases, concurrency, grade);

// Scoring
const exact = results.filter((r) => r.predicted === r.label).length;
const order = ['critical', 'major', 'medium', 'minor'];
const adjacent = results.filter((r) => {
  const a = order.indexOf(r.predicted), b = order.indexOf(r.label);
  return r.predicted === r.label || (a >= 0 && b >= 0 && Math.abs(a - b) === 1);
}).length;
const matrix = Object.fromEntries(LABELS.map((l) => [l, Object.fromEntries([...LABELS, 'other'].map((p) => [p, 0]))]));
for (const r of results) matrix[r.label][LABELS.includes(r.predicted) ? r.predicted : 'other']++;

const pct = (n) => `${Math.round((100 * n) / results.length)}%`;
console.log(`\n${set} · ${promptPath} · ${results.length} reports`);
console.log(`Exact match: ${exact}/${results.length} (${pct(exact)})   Within one level: ${adjacent}/${results.length} (${pct(adjacent)})\n`);
console.log('label \\ predicted'.padEnd(18) + [...LABELS, 'other'].map((l) => l.padStart(10)).join(''));
for (const l of LABELS) console.log(l.padEnd(18) + [...LABELS, 'other'].map((p) => String(matrix[l][p]).padStart(10)).join(''));
console.log('\nMisses:');
for (const r of results.filter((r) => r.predicted !== r.label)) console.log(`- ${r.id}: labelled ${r.label}, graded ${r.predicted}. ${r.reason ?? ''}`);

mkdirSync('results', { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const prompt = promptPath.split('/').pop().replace('.md', '');
writeFileSync(`results/${set}-${prompt}-${stamp}.json`, JSON.stringify({ set, prompt: promptPath, exact, adjacent, total: results.length, results }, null, 2));
if (set === 'holdout') appendFileSync('results/holdout-runs.log', `${stamp} ${promptPath} ${exact}/${results.length}\n`);
