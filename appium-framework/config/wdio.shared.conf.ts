import { TIMEOUTS } from '../test/helpers/timeouts';

// Test logic only. Which device, OS and app to run on comes from the platform configs,
// driven by environment variables, so specs never change between a phone and a device cloud.
export const sharedConfig: Partial<WebdriverIO.Config> = {
  runner: 'local',
  specs: ['../test/specs/**/*.spec.ts'],
  maxInstances: 1,
  logLevel: 'warn',
  bail: 0,
  waitforTimeout: TIMEOUTS.MEDIUM,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 2,
  framework: 'mocha',
  mochaOpts: { ui: 'bdd', timeout: 120_000, grep: process.env.GREP },
  reporters: ['spec', ['junit', { outputDir: './reports/junit', outputFileFormat: ({ cid }) => `results-${cid}.xml` }]],

  // Make false results loud: capture a screenshot and page source for every failure.
  afterTest: async (test, _context, { passed }) => {
    if (passed) return;
    const name = test.title.replace(/[^a-z0-9]+/gi, '-').slice(0, 80);
    await driver.saveScreenshot(`./reports/failures/${name}.png`).catch(() => undefined);
  },
};
