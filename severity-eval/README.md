# Bug severity eval

An evaluation for an AI that grades bug severity. It has a written rubric, labelled bug reports from a public issue tracker, a harness that grades each report with Claude and scores it, and a frozen holdout that can't be tuned on.

Severity drives triage, fix priority and quality metrics. If AI agents are going to set it, the standard has to be written down and tested, the same way you would test any other system.

```bash
node src/run-eval.mjs --set tuning --prompt prompts/classify-v1.md          # iterate here
node src/run-eval.mjs --set holdout --prompt prompts/classify-v1.md --final # final measurement only
```

Needs Node 20+, the GitHub CLI (`gh`) and the Claude Code CLI (`claude`, or set `CLAUDE_BIN`).

## How it works

- **Rubric** ([rubric.md](rubric.md)): severity is decided by one question: *can the affected person still complete what they were trying to do?* Rules cover security, money, workarounds, recoverability and silent failures.
- **Data**: 30 closed bug reports from [Saleor](https://github.com/saleor/saleor), an open-source commerce platform with payments, carts and stock. They're split 15 for tuning and 15 for holdout. The repo stores only the link, a one-line summary in my own words, and the label. The report text is fetched at run time.
- **The report as filed**: the grader sees only the title and the original description, not the discussion that followed, because that's all a triager has at the moment of filing.
- **Frozen holdout**: its SHA-256 hash is checked on every run, it only runs with `--final`, and every look is logged in `results/holdout-runs.log`.
- **Scoring**: exact match, within-one-level match, a confusion matrix, and every miss with the grader's one-line reason.

## Results (prompt v1)

| Set | Exact | Within one level |
|---|---|---|
| Tuning (15) | 12 / 15 (80%) | 14 / 15 (93%) |
| Holdout (15) | 10 / 15 (67%) | 14 / 15 (93%) |

Full runs, with the grader's reasons, are in [results/](results/).

## Label status

The labels are **my draft grades to the rubric, not yet reviewed**. The next step is the review I would run on a team: a person accepts or rejects each disagreement between the grader and the label, plus a random sample of agreements, rather than regrading everything by hand.

Several holdout misses are good candidates for the label to change, not the prompt:

- **saleor-17120** (broken thumbnails): the grader reads the logs as a proxy misconfiguration on the reporter's side, so not a bug. That is a better reading than my Medium.
- **saleor-17619** (available quantity shows zero): the grader notes the report never says selling is blocked, and the query looks misconfigured. That argues for Medium, not my Major.

## Open rubric questions found by the eval

The tuning misses aren't prompt failures. They show where the rubric is ambiguous:

1. **A startup crash in one optional configuration, with a working alternative.** Two reports crash on startup only with an optional setting or install mode. I graded them Medium, because a confirmed workaround exists. The grader said Major, because that configuration is blocked. The rubric needs a rule for "blocked in one configuration, fine in the default".
2. **Integration-specific breakage.** A missing field that breaks one third-party integration: Major (blocked for that integration) or Medium (standard clients work)?

Settling these is a policy decision. It belongs in the rubric, followed by a new tuning pass, never a quiet relabel.

## Lessons

- **An eval shows ambiguity in your own standard** before it shows weakness in the model. Fix the definition first.
- **Never tune on the holdout.** Tuning scores flatter; only the frozen set counts.
- **Review disagreements, not everything.** Human time goes where the grader and the label differ.
- **Grade from the words.** When impact depends on a screenshot the grader can't see, it should say so.
