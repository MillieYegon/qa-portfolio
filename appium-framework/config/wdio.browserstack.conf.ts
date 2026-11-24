import { sharedConfig } from './wdio.shared.conf';

// Same specs, run on BrowserStack's real devices. Credentials and the uploaded app id come
// from the environment (CI secrets), never from the repo.
const required = ['BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY', 'BROWSERSTACK_APP'] as const;
for (const name of required) {
  if (!process.env[name]) throw new Error(`${name} is not set. See README > Device cloud.`);
}

const build = process.env.BUILD_NAME ?? `local-${new Date().toISOString().slice(0, 10)}`;

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  hostname: 'hub.browserstack.com',
  maxInstances: Number(process.env.BROWSERSTACK_PARALLEL ?? 2),
  services: [['browserstack', { app: process.env.BROWSERSTACK_APP, browserstackLocal: false }]],
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'bstack:options': {
        deviceName: process.env.BROWSERSTACK_ANDROID_DEVICE ?? 'Google Pixel 8',
        platformVersion: process.env.BROWSERSTACK_ANDROID_OS_VERSION ?? '14.0',
        projectName: 'Appium portfolio',
        buildName: build, // name builds after the release so results are easy to find
        sessionName: 'Android regression',
        debug: true,
        networkLogs: false, // keep request bodies out of cloud logs
      },
    },
  ],
} as WebdriverIO.Config;
