---
name: generate-test-cases
description: Generate draft manual test cases from a ticket. Reads the ticket and everything it links to, maps the existing suite tree, matches existing coverage by behaviour, writes only the gaps as drafts in Qase (or Markdown), and proposes updates and deprecations instead of duplicates. Runs interactively, or in agent mode with structured output for a scheduled review workflow. Use when asked to "write test cases for", "generate cases from this ticket", "what should we test for TICKET-123", or "/generate-test-cases".
argument-hint: "<TICKET-KEY or pasted ticket text> [agent]"
---

# Generate test cases

Input: $ARGUMENTS

The ticket is the only input needed. Start straight away; don't ask for anything first.

**Modes.** If the input ends with `agent`, run in **agent mode**: create drafts, ask nothing, apply nothing to existing cases, and return the structured block in Step 8. Otherwise run **standalone**: the same flow, with one question at the end.

**Tools.** Use the tracker, test management and design MCP tools directly (for example Jira, Qase and Figma). Don't write scripts or parsers. If a response is too large and lands in a file, read the file.

---

## Step 1: Pick the test project

Map the ticket's product to its test project before anything else. If the mapping is unclear, ask once in standalone mode; in agent mode, stop and report it in `notes`.

## Step 2: Read the ticket, then decide if it needs cases

Read the summary, description, acceptance criteria, comments, linked tickets, sub-tasks and attachments.

Skip the ticket, and say why, when:

- There is nothing a tester can see or do (refactor, dependency bump, internal tooling, spike, technical task).
- It is a sub-task; the parent is covered as a whole.
- Everything it changes is already covered (found in Step 4).

**Bugs** get coverage when the fix could regress. Prefer adding the missing step to the existing case that should have caught it over creating a new case.

**Epics:** generate cases for the feature as a whole, not one batch per story. Stories are delivery slices. Ask "what would a tester actually open the app and check?" and write one case per surface, not one per story.

## Step 3: Follow every link

Open each linked spec, design and discussion thread. Designs show the states the text leaves out: empty, loading, error, disabled, permission-blocked. If a design is linked but can't be opened, say so in the report.

## Step 4: Check existing coverage, by behaviour

Never list every case in a project; it will overflow the context.

**Map the tree first.** Read the project's suite tree (suites only). This shows the real structure, so placement and dedupe don't depend on search luck.

**Then search wide.** Pull several search terms from the ticket, including synonyms and other wordings ("screenshot" / "screen capture"; "QR" / "barcode"). Search cases for each. From the tree and the hits, list **every** suite related to the feature, not just the closest one.

**Then read closely.** Open the cases in each related suite, steps included, and ask:

- Does an existing case already check this behaviour, even under another suite or other words?
- Is it already a step inside a broader case?

Match on behaviour, not title text. A near-duplicate in different words is still a duplicate.

- Unchanged behaviour already covered: **skip** it and note the covering case.
- Changed behaviour: propose a **suggested update** to that case, not a new case.

## Step 5: Place the cases

- Reuse an existing suite when the feature already has one, matching its name exactly.
- Otherwise create a suite under the closest parent. Create a top-level suite only for a genuinely new area.
- Name the suite after the specific feature (`Recipients: Saving`).
- Keep the tree 2 to 3 levels deep. Consolidate rather than fragment.
- For a large epic (10+ cases), group cases into 3 to 6 sub-suites by feature area instead of one flat list.

## Step 6: Write the cases

**What to cover**, derived from the ticket and its links:

- Every acceptance criterion (at least one case each)
- The core happy path
- Error, empty and negative states (invalid input, missing data)
- Permission and role boundaries; signed-out behaviour
- Mobile conditions where relevant: app backgrounded or closed, slow or no network, OS permissions
- Analytics events, if the ticket mentions them

**What not to cover:**

- **Implementation safeguards a tester can't set up or see:** race conditions, dedupe guards, memory limits, circular-reference protection. Those belong in unit and integration tests.
- **API or network checks.** No "check the Network tab". These are manual UI cases.
- **"Still works" cases** for behaviour that already has coverage. That is a regression run of the existing cases, not new coverage. Add one only where there is a real gap.
- **Anything you can't write as concrete steps.** If the setup would be "create a scenario where…", the case isn't manually testable. Drop it and say why.

**One case, one behaviour.** A case reads in seconds, usually 3 to 7 steps. If it grows past that into a second behaviour, split it.

Fold a scenario into another case as extra steps **only** when it continues exactly where that case ends, with no setup of its own (for example, reopening the draft the case just saved). Anything needing its own setup, such as a force-closed app, is its own case.

**Platform differences:** keep iOS and Android in one case, with each platform as its own step or expected-result line. Never one case per platform.

### Titles

- Start with **"Verify that"** and read as a natural sentence, roughly 15 to 25 words.
- One behaviour. A single "and" joining a setup to its result is fine; chaining outcomes means it should be split.
- Don't repeat the feature or suite name after "Verify that". The suite already says it.

✅ `Verify that saving a recipient whose account lookup failed is blocked and the account name stays empty`
❌ `Recipient lookup failure blocks save` (no "Verify that", clipped)
❌ `Verify that the lookup works, the nickname saves, and duplicates are refused while unverified users are redirected` (four cases in one)

### Description

Leave it **empty**. The title, preconditions and steps carry the case. The one exception is a design-driven case, where the description holds only the design link. Never restate the ticket or add a source line; the ticket tag gives traceability.

### Preconditions

- State only what is **already true**: `Customer is signed in to the mobile app`.
- **At most 3 lines,** one per line, using real line breaks.
- If someone had to do something to make it true, it's a step: "Recipient has been saved" is the step *Save a recipient*. "App is closed" is the step *Force-close the app*.

### Steps

- **One short action per step,** one imperative sentence, under about 12 words.
- One path per step. Hardware Back, header Back and swipe-back are three steps.
- Concrete values: `Enter 0123456789 in **Account number**`, never "enter valid data".
- Navigation and setup are steps; don't hide them in preconditions.
- Bold UI element names (**Send money**); backticks for buttons and fields (`Save`). Plain text otherwise, no quotes around step text.
- Human, not robotic: "Tap `Save`", not "Now the tester should tap on the Save button", and not "Tap. Enter. Observe."
- Clear enough for a new team member to follow without guessing.

### Expected results

- One per step, aligned by step number, and only where there is something to check. Leave the rest empty, with no placeholder.
- One short sentence, with the key assertion in bold.
- Assert the behaviour, not the full UI copy: `**Duplicate warning** appears and nothing is saved`, not the full modal text and button colours.

### Voice across a batch

Write like one thoughtful person wrote the whole set. Vary sentence openers; avoid template cadence.

### Priority (mandatory)

- **High:** core critical paths, money movement, security, must run in every regression.
- **Medium:** general functional cases, run in full and targeted regressions.
- **Low:** cosmetic and rarely used paths.

### Test data

Synthetic only. Never copy real names, emails, phone numbers, account numbers or tokens into a case.

## Step 7: Create the drafts

With Qase (or another tool) connected:

- Create cases **one at a time**: create the case, then add its steps in a separate update, then move to the next. Steps sent on create can fail validation.
- Pass steps as a real array of `{action, expected_result}`, never a JSON string.
- Always **status = Draft** and a **priority**.
- **Tag** every case with the ticket key and `ai-generated`. A project can hold hundreds of drafts; the tag is what isolates this batch for review.
- Don't set severity, type, automation or other fields the reviewer owns.
- If a field is rejected, retry without it and report which field needs setting by hand.

Without a test tool: write Markdown in the same shape (title, priority, preconditions, steps table).

## Step 8: Report

**Created:** each case with its ID, title and priority.
**Skipped (already covered):** each scenario with the covering case ID, and the step number if it's a step inside a broader case.
**Suggested updates:** existing cases that are now incomplete, by ID and title, with the step to add.
**Suggested deprecations:** existing cases this change makes obsolete, with a one-line reason. Never edit or delete them yourself.
**Notes:** design not reachable, fields that failed, open questions.

**Standalone:** then ask once: *"Apply these N updates and M deprecations? (yes / no)"*. On yes, append the new steps (keep existing steps word for word) and mark deprecations. Never deprecate without asking.

**Agent mode:** ask nothing, apply nothing, and return only:

```yaml
ticket: <KEY>
project: <CODE>
suite: { id: <id>, path: "<parent / suite>" }
created:
  - { id: <id>, title: "<title>", priority: <High|Medium|Low>, url: "<case url>" }
suggested_updates:
  - { case_id: <id>, title: "<title>", proposed_step: "<action> → <expected>" }
suggested_deprecations:
  - { case_id: <id>, title: "<title>", reason: "<why>" }
skipped:
  - { scenario: "<scenario>", covered_by: <id> }
notes: []
```

If nothing should be created, return the same block with `created: []` and the reason in `notes`, so the workflow skips the review.

A reviewer then approves, edits or rejects the batch. Only approved drafts become active cases.
