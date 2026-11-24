import { BasePage } from './base.page';
import { byTestId, byText } from '../helpers/selectors';
import { hideKeyboardIfShown, tap } from '../helpers/gestures';
import { TIMEOUTS } from '../helpers/timeouts';

class FormsPage extends BasePage {
  get textInput() {
    return byTestId('text-input');
  }
  get textInputResult() {
    return byTestId('input-text-result');
  }
  get switchToggle() {
    return byTestId('switch');
  }
  get switchLabel() {
    return byTestId('switch-text');
  }
  get dropdown() {
    return byTestId('Dropdown');
  }
  get activeButton() {
    return byTestId('button-Active');
  }

  /** Dropdown options render in a native picker with no testID, so they are found by text. */
  dropdownOption(label: string) {
    return byText(label);
  }

  async fillTextInput(value: string) {
    await this.textInput.setValue(value);
    await hideKeyboardIfShown();
  }

  async chooseDropdownOption(label: string) {
    await tap(this.dropdown);
    await this.dropdownOption(label).waitForDisplayed({ timeout: TIMEOUTS.SHORT });
    await tap(this.dropdownOption(label));
    await this.dropdownOption(label).waitForDisplayed({ timeout: TIMEOUTS.SHORT });
  }
}

export default new FormsPage();
