import { appendFileSync, mkdirSync, writeFileSync } from 'fs';
import type { FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';

interface Row {
  title: string;
  caseIds: string[];
  status: string;
  durationMs: number;
}

/**
 * Writes a Markdown run summary with one row per test and its test case IDs, so results
 * map straight back to the test management tool. In GitHub Actions it also goes to the job summary.
 */
export default class SummaryReporter implements Reporter {
  private rows: Row[] = [];

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.retry < test.retries && result.status !== 'passed') return; // keep only the final attempt
    this.rows.push({
      title: test.title,
      caseIds: test.tags.filter((tag) => /^@TS-\d+$/.test(tag)).map((tag) => tag.slice(1)),
      status: test.outcome() === 'flaky' ? 'flaky' : result.status,
      durationMs: result.duration,
    });
  }

  onEnd(result: FullResult) {
    const count = (status: string) => this.rows.filter((row) => row.status === status).length;
    const icon: Record<string, string> = { passed: '✅', failed: '❌', timedOut: '⏱️', skipped: '⏭️', flaky: '⚠️' };
    const lines = [
      `## Toolshop E2E: ${result.status}`,
      '',
      `${count('passed')} passed · ${count('failed') + count('timedOut')} failed · ${count('flaky')} flaky · ${count('skipped')} skipped`,
      '',
      '| | Test | Case | Time |',
      '|---|---|---|---|',
      ...this.rows.map(
        (row) =>
          `| ${icon[row.status] ?? row.status} | ${row.title} | ${row.caseIds.join(', ') || '-'} | ${(row.durationMs / 1000).toFixed(1)}s |`,
      ),
      '',
    ];
    const markdown = lines.join('\n');
    mkdirSync('test-results', { recursive: true });
    writeFileSync('test-results/summary.md', markdown);
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
  }
}
