# Appium and WebdriverIO framework

Mobile end-to-end tests for the open-source [WebdriverIO native demo app](https://github.com/webdriverio/native-demo-app), a React Native app. It covers login and sign-up, form controls, native dialogs and scrolling. It puts the practices from the [mobile automation guide](../mobile-automation-guide/) into code.

The same specs run on a local Android emulator or phone and on BrowserStack's real devices. Only the configuration changes.

```bash
npm ci
npm run app:download      # fetch the demo app APK
npm run test:android      # emulator or USB device; starts Appium for you
npm run test:smoke        # @smoke only
```

Needs Node 20+, Java 17+, the Android SDK (`ANDROID_HOME`) and a running emulator or a connected phone.

## Device configuration

Everything device-specific is an environment variable, so a new device is a new variable, not a code change:

| Variable | Used for |
|---|---|
| `ANDROID_UDID` | a specific phone or emulator (`adb devices`) |
| `ANDROID_AVD` | boot a named emulator |
| `ANDROID_APP_PATH` | a different build of the app |
| `GREP` | run a tag, such as `@smoke` or `@TS-401` |

### Device cloud (BrowserStack)

```bash
export BROWSERSTACK_USERNAME=... BROWSERSTACK_ACCESS_KEY=...
export BROWSERSTACK_APP=bs://<id from the app upload>
export BUILD_NAME="release-1.4.0"            # builds named after the release
export BROWSERSTACK_ANDROID_DEVICE="Samsung Galaxy S23" BROWSERSTACK_ANDROID_OS_VERSION="13.0"
npm run test:browserstack
```

Credentials only ever come from the environment. The config fails fast with a clear message if one is missing.

## What it shows

| Practice | Where |
|---|---|
| Locator priority (testID, then label, then text) with all platform branching in one helper | `test/helpers/selectors.ts` |
| Real touch taps, because some React Native touchables ignore `element.click()` | `tap()` in `test/helpers/gestures.ts` |
| Platform-driven scrolling, with a fraction-of-screen swipe as the fallback | `scrollToTestId()`, `swipeUp()` |
| Hiding the keyboard before tapping buttons below inputs | `hideKeyboardIfShown()` |
| Waiting for the next screen before acting on it | `BasePage.openTab()` |
| Page objects with getters for locators; assertions only in specs | `test/pageobjects/` |
| One file of timeouts and deliberate pacing | `test/helpers/timeouts.ts` |
| A clean app per spec file, and a screenshot for every failure | `config/` |
| Test titles that are the test case titles, tagged with case IDs | `test/specs/` |

## Found while building it

- **Hand-rolled swipes didn't scroll the React Native scroll view** on the emulator, even with a hold before the move. Letting the platform scroll (`UiScrollable.scrollIntoView` on Android, `mobile: scroll` on iOS) worked first time, and stops as soon as the element appears. That is now the default, and the raw swipe is the fallback.
- **Validation messages and dropdown options have no testID** in the app, so they fall back to text (priority 3). In a real team, those would go on the list of testIDs to request from the app developers.

## Results

8 tests across 3 spec files, passing on two consecutive full runs on an Android 14 emulator, in about 45 seconds each. The BrowserStack configuration hasn't been run against a live account.
