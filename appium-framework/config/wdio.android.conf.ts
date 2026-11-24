import path from 'path';
import { sharedConfig } from './wdio.shared.conf';

// Local Android: an emulator or a phone plugged in by USB. Everything device-specific is an
// environment variable with a sensible default, so a new device is a new variable, not a code change.
const app = process.env.ANDROID_APP_PATH ?? path.resolve(__dirname, '../apps/android.wdio.native.app.v2.2.0.apk');

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  port: 4723,
  services: [['appium', { command: 'appium', args: { relaxedSecurity: false, log: './reports/appium.log' } }]],
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      ...(process.env.ANDROID_UDID ? { 'appium:udid': process.env.ANDROID_UDID } : {}),
      ...(process.env.ANDROID_AVD ? { 'appium:avd': process.env.ANDROID_AVD } : {}),
      'appium:app': app,
      'appium:appWaitActivity': '*',
      // A clean app for every spec file, so state never leaks between specs.
      'appium:fullReset': false,
      'appium:noReset': false,
      'appium:newCommandTimeout': 240,
    },
  ],
} as WebdriverIO.Config;
