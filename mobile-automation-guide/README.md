# Mobile automation guide: Appium, WebdriverIO and React Native

How I build mobile end-to-end suites that stay green. These are lessons from taking React Native apps from manual smoke checks to automated suites running on testers' own phones and on a device cloud.

## Start small, on real devices

1. **Prove one gold-standard test first.** Login plus one data-entry flow, verified end to end. Everything after it is converted from that reference.
2. **Run locally on testers' own devices before scaling.** The suite replaces manual smoke checks straight away. A device cloud comes once the tests are stable.
3. **Keep the same specs everywhere.** Local and cloud runs differ only in configuration.

## Keep tests device-agnostic

- **Device, OS and app build come from environment variables** in the runner config, never from a spec or page object. A new device is a new variable, not a code change.
- **No pixel coordinates.** Scroll with the platform (for example `mobile: scrollGesture` bounded by the scrollable container, or Android's `UiScrollable`). Where a raw gesture is unavoidable, use fractions of the window size.
- **No assumptions about the attached device.** Model-specific setup belongs in setup docs, not test code.

Rule of thumb: if a value would change between one tester's phone and a cloud device, it belongs in configuration.

## Locator priority

Work down this list and use the first option the app offers today:

| Priority | Locator | Backed by (iOS / Android) |
|---|---|---|
| 1 | Test ID | accessibilityIdentifier / resource-id (React Native `testID`) |
| 2 | Accessibility label | accessibilityLabel / content-desc |
| 3 | Visible text | label predicate / UiSelector text |
| 4 | Structural XPath | last resort |

Put the platform branching in one helper (`byTestId`, `byLabel`, `byText`) so specs never contain platform-specific selectors. When you have to fall back to text or XPath, write the test anyway and log a recommended test ID for the app team. Missing test IDs are a testability backlog, and fixing them in a shared component library fixes every app that uses it.

## React Native gotchas

1. **Tap with a real pointer gesture.** Some React Native touchables ignore `element.click()`; a W3C pointer down, short pause, pointer up at the element's centre fires `onPress` reliably.
2. **Wait for buttons to be enabled.** Tapping a disabled button is a silent no-op.
3. **Hide the keyboard before tapping below an input.** The soft keyboard covers or swallows the tap.
4. **Type into masked or formatted inputs one key at a time,** with a short pause between keys. Setting the value directly races the formatter and duplicates characters.
5. **A country-code prefix is usually a picker,** not editable text. Select it, then type the national number.
6. **Duplicate accessibility nodes.** The same label can sit on a text node and on the real button; scope to the clickable one.
7. **Wait for the next screen before acting on it.** Otherwise input lands in a field on the screen you are leaving.

## Stability

- **Wait on a signal, not a timer.** `waitForDisplayed` on a specific element, never `pause()` to wait for state. Keep deliberate pacing (keystrokes) in named constants.
- **All timeouts in one file.** Tune them in one place.
- **`isDisplayed()` and `isExisting()` don't wait.** Use the `waitFor…` variants to block.
- **Verify the outcome, not the tap.** After submitting, open the saved record and check the values persisted.
- **Make false results loud.** An unexpected system alert or a failed login must fail the test with a clear message, never let it pass or fail for the wrong reason.
- **Restart the app cleanly between specs** where state leaks.
- **Clean up what the test created,** in guarded teardown that doesn't hide the original failure.
- **Demo accounts and synthetic data only.**

## Structure

- **Page objects** expose locators as getters and actions as methods. **Assertions live in specs only.**
- **Spec titles match the test case title** and carry the case ID and tags (`@smoke`), so results map back to the test management tool automatically.
- **Coverage is counted from the code that runs,** not from a flag in the test management tool.

## CI

- Upload every app build to the device cloud automatically.
- Name cloud builds after the release so results are easy to find.
- Emit JSON results and report them into the test management tool and a team chat channel.

## Checklist for a new test

- [ ] Title matches the test case, with its ID and tags
- [ ] Locators follow the priority list; fallbacks have a test ID recommendation logged
- [ ] No pixel coordinates, no hard-coded device values
- [ ] No sleeps to wait for state
- [ ] Assertions only in the spec
- [ ] Created data cleaned up
- [ ] Run on a real device and on the cloud, result reported
