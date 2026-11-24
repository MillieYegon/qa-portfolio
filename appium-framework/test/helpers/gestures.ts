import type { ChainablePromiseElement } from 'webdriverio';
import { PACING } from './timeouts';

type Element = ChainablePromiseElement;

/**
 * Taps the element's centre with a real touch pointer.
 * Some React Native touchables ignore the accessibility click that `element.click()` sends,
 * so `onPress` never fires. A pointer down, short hold, pointer up always does.
 */
export async function tap(element: Element) {
  await element.waitForEnabled();
  const { x, y } = await element.getLocation();
  const { width, height } = await element.getSize();
  await driver
    .action('pointer', { parameters: { pointerType: 'touch' } })
    .move({ x: Math.round(x + width / 2), y: Math.round(y + height / 2) })
    .down()
    .pause(PACING.TAP_HOLD_MS)
    .up()
    .perform();
}

/**
 * Swipes up by a fraction of the screen height, never by pixels, so the same test works
 * on any screen size.
 */
export async function swipeUp(fraction = 0.5) {
  const { width, height } = await driver.getWindowSize();
  const x = Math.round(width / 2);
  const startY = Math.round(height * (0.5 + fraction / 2));
  const endY = Math.round(height * (0.5 - fraction / 2));
  await driver
    .action('pointer', { parameters: { pointerType: 'touch' } })
    .move({ x, y: startY })
    .down()
    .pause(PACING.TAP_HOLD_MS) // React Native scroll views ignore a move that starts the instant the finger lands
    .move({ x, y: endY, duration: PACING.SWIPE_MS })
    .up()
    .perform();
}

/**
 * Scrolls the screen until the element with this testID is on screen, letting the platform do
 * the scrolling (Android UiScrollable, iOS mobile: scroll). Preferred over hand-rolled swipes:
 * it works on any screen size and stops as soon as the element is found.
 */
export async function scrollToTestId(testId: string) {
  if (driver.isIOS) {
    await driver.execute('mobile: scroll', { direction: 'down', predicateString: `name == "${testId}"` });
    return;
  }
  await $(
    `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().description("${testId}"))`,
  ).waitForExist();
}

/** Raw-gesture fallback: swipes up until the element is on screen, failing clearly instead of looping forever. */
export async function swipeUpUntilDisplayed(element: Element, maxSwipes = 5) {
  for (let swipe = 0; swipe <= maxSwipes; swipe++) {
    if (await element.isDisplayed()) return;
    await swipeUp();
  }
  throw new Error(`Element still not displayed after ${maxSwipes} swipes`);
}

/** Hides the soft keyboard if it is open. It covers, and swallows taps on, buttons below inputs. */
export async function hideKeyboardIfShown() {
  try {
    if (await driver.isKeyboardShown()) await driver.hideKeyboard();
  } catch {
    // Some platforms report no keyboard API; nothing to hide.
  }
}
