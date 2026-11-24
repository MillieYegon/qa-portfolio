# Playwright framework

End-to-end tests for [Toolshop](https://practicesoftwaretesting.com), a public demo store built for test automation practice. It covers sign-in, product search and filtering, and checkout payments, including bank transfer orders checked all the way to the invoice.

```bash
npm ci
npx playwright install chromium
npm test              # full suite, 4 workers
npm run test:smoke    # @smoke only
npm run report        # open the HTML report
```

## What it shows

| Practice | Where |
|---|---|
| Page objects with every locator declared once, as a constructor property | `src/pages/` |
| Test data seeded through the API, not the UI | `src/api/toolshop-api.ts`, `src/fixtures/fixtures.ts` |
| Worker-isolated parallel runs: each worker registers its own customer | `account` fixture |
| A fresh cart per test, injected into the browser | `seedCart` fixture |
| Sign-in by token for every test except the sign-in test itself | `signedIn` fixture |
| Outcomes verified at the source, not by a success toast | `tests/checkout/payment.spec.ts` |
| Test titles that are the test case titles, tagged with case IDs | every spec |
| CI on push, pull request and nightly, with a Markdown run summary | `.github/workflows/playwright.yml`, `src/reporters/` |

## Design decisions

- **Setup through the API, checks through the UI.** Registration, sign-in and carts are created with API calls, so each test spends its time on the behaviour it is named after. The payment test still finishes in the UI, then confirms the order really exists, with the right amount and payment method.
- **Isolation makes parallelism safe.** Workers never share an account, and tests never share a cart. That is why the suite can run on 4 workers without ordering or retries.
- **A polite worker cap.** The backend is a shared public demo, so the default is 4 workers. `PW_WORKERS` raises it, and an invalid value fails fast instead of being silently ignored.
- **Retries with backoff only on setup calls,** and only for rate limits and server errors. A failing setup call reports its status and body, so a broken setup never looks like a product bug. Tokens never appear in logs.
- **Synthetic data only.** Every run creates fresh `example.com` customers.
- **One file of timeouts.** No sleeps in specs or page objects; every wait is on a signal.

## Conventions

- Locators: `data-test` first (set as Playwright's test ID attribute), then role, then text. Any class or id selector carries a one-line comment saying why nothing better existed.
- Page objects extend `BasePage`. Methods wrap meaningful multi-step actions; no single-click wrapper methods.
- Assertions live in specs only.
- Specs import `test` and `expect` from the fixtures file, never from `@playwright/test` directly.
- Tags: `@smoke`, `@regression`, a feature tag, and the case ID (`@TS-301`).

## Found while building it

- **The API and the sign-in form disagree on password length.** The API accepts a 41-character password at registration, but the sign-in form rejects it with "Password length is invalid", so that customer can never sign in through the UI. The test user factory now keeps passwords short, and the gap is a bug report waiting to be filed.
- **The saved address loads in after the checkout form renders** and overwrites anything typed earlier. The page object waits for the address to arrive before typing, instead of retrying.
- **The product grid re-renders after the search caption updates.** Reading it once raced the re-render; the spec now uses retrying assertions.

## Results

9 tests, 27 of 27 passing across three repeated runs on 4 workers, in about 35 seconds.
