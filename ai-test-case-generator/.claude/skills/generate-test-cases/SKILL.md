---
name: generate-test-cases
description: Generate reviewed, deduplicated manual test cases from a ticket. Reads the ticket and its linked specs and designs, checks existing coverage, writes only what is missing as drafts, and proposes updates or deprecations for existing cases. Use when asked to "write test cases for", "generate cases from this ticket", "what should we test for TICKET-123", or "/generate-test-cases".
argument-hint: "<TICKET-KEY or pasted ticket text> [agent]"
---

# Generate test cases

Input: $ARGUMENTS

If the input ends with the word `agent`, run in **agent mode** (no questions, structured output). Otherwise run **interactive mode**.

## 1. Read everything first

- Fetch the ticket through the tracker's MCP tools if available; otherwise use the pasted text.
- Read the description, acceptance criteria, comments and linked specs or designs. A design shows states the text leaves out: empty, loading, error, disabled.
- Do not ask questions before you have read everything. Ask only about what is still ambiguous after reading, and in agent mode record it as an open question instead.

## 2. Relevance gate

Decide whether the ticket needs new cases. Skip, and say why, when:

- It has no user-visible behaviour (refactor, dependency bump, internal tooling, spike).
- The behaviour is already covered by regression cases (see step 3).
- It is a sub-task of a ticket that will be covered as a whole.

Bugs get a case when the fix could regress: write one case that reproduces the original failure and checks the fix.

## 3. Check existing coverage

Before writing, search the test library:

1. Cases tagged or linked with the ticket key.
2. Cases in the suite for this feature area, and in related suites the change touches.
3. Cases with similar titles.

Sort the results into: **already covered** (no new case), **needs an update** (behaviour changed), and **superseded** (the feature replaced it; propose deprecation). Write new cases only for the gaps.

## 4. Write the cases

Cover, in this order, only where they apply:

1. Main success path for each acceptance criterion.
2. Validation and error states (invalid input, limits, empty values).
3. Permissions and roles (who can and cannot do it).
4. State and data (persistence after refresh, edit, delete, undo).
5. Platform and environment (mobile, offline, timezone, locale) when the feature depends on them.
6. Interaction with neighbouring features the change touches.

Rules for every case:

- **Title:** `<Feature area>: <what happens> when <condition>`. Specific enough to tell it apart from its neighbours.
- **One behaviour per case.** Split rather than chain unrelated checks.
- **Preconditions:** the role, data and settings needed, stated so a tester can set them up.
- **Steps:** concrete actions with real example values ("Enter 10,000.50 in Amount"), never "enter valid data".
- **Expected result:** observable by the user, for each step that has one.
- **No API or database checks.** If it can only be verified below the UI, say it belongs in automated or developer tests.
- **Priority:** High for money, data loss, security or a blocked core workflow; Medium for a degraded workflow with a workaround; Low for cosmetic.
- **Tag** each case with the ticket key and the feature area.
- **Test data is synthetic.** Never copy real names, emails, phone numbers, account numbers or tokens into a case.
- Keep descriptions short. The steps carry the detail.

## 5. Save as drafts

- With a test management tool connected: create each case as a **draft** in the matching suite. Never mark it active or approved.
- Without one: write Markdown (default) or CSV with columns `title, suite, priority, preconditions, steps, expected, tags`.

## 6. Report

**Interactive mode.** Show a short summary:

- What was skipped and why
- New cases (titles only, grouped by theme)
- Proposed updates to existing cases, as before and after
- Proposed deprecations, with the reason
- Open questions

Then ask whether to apply the proposed updates. Apply nothing to existing cases without a yes.

**Agent mode.** Ask nothing and change no existing case. Return only this JSON:

```json
{
  "ticket": "PAY-101",
  "decision": "cases_created | skipped",
  "skip_reason": null,
  "new_cases": [{"id": "", "title": "", "priority": "", "suite": ""}],
  "proposed_updates": [{"id": "", "change": ""}],
  "proposed_deprecations": [{"id": "", "reason": ""}],
  "open_questions": []
}
```

A reviewer then approves, edits or rejects the batch. Only approved drafts become active cases.
