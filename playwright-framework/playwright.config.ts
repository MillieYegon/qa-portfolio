import { defineConfig, devices } from '@playwright/test';

export const UI_BASE_URL = process.env.UI_BASE_URL ?? 'https://practicesoftwaretesting.com';
export const API_BASE_URL = process.env.API_BASE_URL ?? 'https://api.practicesoftwaretesting.com';

// One place for every wait. Specs and page objects never hard-code a timeout.
export const TIMEOUTS = {
  SHORT: 5_000,
  MEDIUM: 10_000,
  LONG: 30_000,
} as const;

// Each worker registers and owns its own account (see src/fixtures), so workers never share state.
// The cap keeps load on the public demo backend polite; raise it with PW_WORKERS.
const workers = Number(process.env.PW_WORKERS ?? 4);
if (!Number.isInteger(workers) || workers < 1) {
  throw new Error(`PW_WORKERS must be a positive integer, got "${process.env.PW_WORKERS}"`);
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  timeout: TIMEOUTS.LONG * 2,
  expect: { timeout: TIMEOUTS.MEDIUM },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['./src/reporters/summary-reporter.ts'],
  ],
  use: {
    baseURL: UI_BASE_URL,
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: TIMEOUTS.MEDIUM,
    navigationTimeout: TIMEOUTS.LONG,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
