# AI test case generator

A Claude Code skill that reads a ticket and writes test cases a tester can run straight away. It checks what is already covered before writing anything, saves its work as drafts, and leaves the final call to a person.

## Why

New features often ship without test cases, because writing them is the step QA skips under pressure. Regression suites then fall behind the product, and when a bug escapes there is no case to point to. Generating cases is easy; generating cases a team will trust is the hard part. This skill is built around that.

## How it works

```
ticket (Jira via MCP, or pasted text)
  → read the ticket, acceptance criteria, linked specs and designs
  → relevance gate: is there user-visible behaviour to test?
  → coverage check: search existing cases by ticket key and feature area
  → write only what is missing; propose updates and deprecations for the rest
  → save as drafts (test management tool) or Markdown/CSV
  → a person approves, edits or rejects
```

## Design decisions

- **Drafts, never live.** Nothing reaches the regression suite without a human approving it.
- **Check coverage before writing.** Duplicates erode trust in a suite faster than gaps do.
- **Concrete, user-observable steps.** Real values, one behaviour per case, no API-level checks, so any tester can run it.
- **The library can shrink.** The skill suggests deprecating cases a new feature supersedes.
- **Two modes.** Interactive for a person at the keyboard; agent mode returns structured output for a scheduled workflow (for example, a Zapier trigger when a ticket reaches UAT, with approval by Slack reaction).

## Use it

1. Copy `.claude/skills/generate-test-cases/` into your project or `~/.claude/skills/`.
2. In Claude Code: `/generate-test-cases PAY-101`, or paste the ticket text after the command.
3. See [examples/](examples/) for a synthetic ticket and the cases it produced.

Connect a tracker and a test management tool through MCP if you have them. Without them, the skill works from pasted text and writes Markdown or CSV.
