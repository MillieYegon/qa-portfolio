---
name: create-automated-test
description: Turn one or more manual test cases into Playwright tests that follow this framework's conventions. Reads the case, the existing specs, page objects, fixtures and API helpers, verifies every locator against the real app, presents a plan, and writes code only after the plan is confirmed. Never invents locators or test data; flags anything missing for a person to add. Use when asked to "automate this case", "write a test for TS-###", "scaffold tests from these cases" or "/create-automated-test".
argument-hint: "<case ID(s) or pasted case text>"
---

# Create automated test

Input: $ARGUMENTS

Start Stage 1 straight away. Don't summarise or explore first.

## Stage 1: Get the cases

Fetch each case from the test management tool if connected (title, preconditions, steps, expected results); otherwise use the pasted text. If a case has no steps, stop and ask whether to draft steps from the title or skip it. Never guess a whole flow from a title alone.

## Stage 2: Classify

For each case decide: **automatable now**, **needs setup that doesn't exist yet** (skip and say what is missing), or **not automatable** (visual judgement, physical device, third-party email). Only the first group goes forward.

## Stage 3: Reconnaissance (no writing yet)

For each case work out:

1. **Spec file.** Append to the spec whose feature matches; otherwise propose a new file named like its neighbours.
2. **Describe block.** Group by shared setup (`beforeEach`), not by suite. Reuse a describe with the same setup; otherwise propose one whose name explains the shared setup.
3. **Page objects.** Which exist, which methods and locators already exist, which fixtures wire them in. New pages extend `BasePage`.
4. **Data setup.** Can the API helpers and fixtures create what the preconditions need (`account`, `signedIn`, `seedCart`)? If not, the case is blocked: say exactly what helper is missing.
5. **Cleanup.** Does the test create anything that outlives it and isn't isolated per worker? If so, plan an `afterEach`.
6. **Steps to code.** Map every step to a page method or an assertion. Compose existing methods before adding new ones.
7. **Tags.** `@regression`, the feature tag already in use, and the case ID. Never add `@smoke` yourself; that is a suite decision.

**Rules while planning:**

- **Never skip a step.** Each step is implemented, or the whole case is blocked. If a step reads "if X is already done, Y shows", set X up first (in `beforeEach`, earlier in the test, or through the API).
- **"Any of the following: A, B, C" means test all of them,** one locator and one assertion each. No `.first()` standing in for a group.
- **A success message is not proof.** If the expected result says "X appears in Y", go to Y and assert X, or confirm the record exists.
- **Check the case wording against the real app.** If the message text, button state or destination differs from the case, flag it in the plan.
- **Ask when a visual state is ambiguous** ("the form is locked") and the app doesn't make the observable change clear.

## Locator verification

Before adding any locator, confirm it exists:

- With app source: search it for the `data-test` value (and legacy variants such as `data-testid`).
- Without source: open the page in a browser (Playwright MCP or a quick script) and confirm the element is there.

A locator that can't be confirmed is never added. Leave `// TODO: locator not found, needs a data-test attribute` and list it in the report.

Priority: `data-test` (via `getByTestId`) → role with name → text → placeholder → id or class. Anything from text downward gets a one-line comment saying why nothing better existed.

## Stage 4: Present the plan and wait

For each case:

```
### TS-301 · Verify that paying by bank transfer completes the order and the new invoice appears…
- Spec: tests/checkout/payment.spec.ts (existing) · Describe: Checkout payment (existing)
- Setup: signedIn + seedCart(Combination Pliers × 2) · Cleanup: none, worker-isolated account
- Reused: checkoutPage.goToPaymentStep, checkoutPage.fillBankTransfer, invoicesPage.invoiceRow
- New: none, all locators verified
- Tags: @regression @payments @TS-301
- ⚠️ Notes: none
```

Write nothing until the plan is confirmed.

## Stage 5: Write, run, report

Code rules:

- Every locator is a `readonly` property set in the page object's constructor. No locators in specs. Dynamic locators are methods returning a `Locator`.
- Name locators `purposeElementType` (`finishButton`, `cardNumberInput`).
- Methods are 5 to 10 lines and wrap a meaningful sequence. No single-click wrappers.
- Name methods `openX` (short navigation), `goToX` (longer), `fillX` (input).
- Assertions in specs only. Specs import `test` and `expect` from the fixtures file.
- The test title is the case title, word for word.
- No sleeps. Wait on a signal; timeouts come from the shared `TIMEOUTS`.
- Test data comes from `test-data.ts` or the user factory. Never real people's details.

Then type-check, run the new tests at least three times (`--repeat-each=3`), and report: tests added, locators added, anything flagged, and any case wording that didn't match the app.
