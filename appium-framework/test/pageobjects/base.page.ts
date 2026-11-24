import { byTestId, nativeDialog } from '../helpers/selectors';
import { tap } from '../helpers/gestures';
import { TIMEOUTS } from '../helpers/timeouts';

export type Tab = 'Home' | 'Login' | 'Forms' | 'Swipe';

export class BasePage {
  get dialogMessage() {
    return nativeDialog.message();
  }

  get dialogOkButton() {
    return nativeDialog.okButton();
  }

  tabButton(tab: Tab) {
    return byTestId(tab);
  }

  /** Opens a tab and waits for that screen, so the next action never lands on the old screen. */
  async openTab(tab: Tab) {
    await tap(this.tabButton(tab));
    await byTestId(`${tab}-screen`).waitForDisplayed({ timeout: TIMEOUTS.MEDIUM });
  }

  async dismissDialog() {
    await this.dialogOkButton.waitForDisplayed({ timeout: TIMEOUTS.MEDIUM });
    await tap(this.dialogOkButton);
    await this.dialogOkButton.waitForDisplayed({ reverse: true, timeout: TIMEOUTS.SHORT });
  }
}
