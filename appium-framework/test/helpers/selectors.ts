// Locator helpers. All platform branching lives here, so specs and page objects never
// contain iOS- or Android-specific selectors.
//
// Priority: byTestId (React Native testID) → byLabel → byText → raw selector (last resort).

/** React Native `testID` / accessibility id. Same value on iOS and Android. */
export const byTestId = (id: string) => $(`~${id}`);

/** Accessibility label (iOS accessibilityLabel, Android content-desc). */
export const byLabel = (label: string) =>
  driver.isIOS ? $(`-ios predicate string:label == "${label}"`) : $(`android=new UiSelector().description("${label}")`);

/** Visible text. Brittle across copy changes and locales: use only when no id or label exists. */
export const byText = (text: string) =>
  driver.isIOS
    ? $(`-ios predicate string:label == "${text}" OR value == "${text}"`)
    : $(`android=new UiSelector().text("${text}")`);

/** Native system dialog parts. These belong to the OS, not the app, so they have no testID. */
export const nativeDialog = {
  message: () =>
    driver.isIOS ? $('-ios class chain:**/XCUIElementTypeAlert/**/XCUIElementTypeStaticText[2]') : $('id=android:id/message'),
  okButton: () => (driver.isIOS ? $('~OK') : $('id=android:id/button1')),
};
