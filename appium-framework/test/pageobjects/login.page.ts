import { BasePage } from './base.page';
import { byTestId, byText } from '../helpers/selectors';
import { hideKeyboardIfShown, tap } from '../helpers/gestures';
import { TIMEOUTS } from '../helpers/timeouts';

class LoginPage extends BasePage {
  get loginTabButton() {
    return byTestId('button-login-container');
  }
  get signUpTabButton() {
    return byTestId('button-sign-up-container');
  }
  get emailInput() {
    return byTestId('input-email');
  }
  get passwordInput() {
    return byTestId('input-password');
  }
  get repeatPasswordInput() {
    return byTestId('input-repeat-password');
  }
  get loginButton() {
    return byTestId('button-LOGIN');
  }
  get signUpButton() {
    return byTestId('button-SIGN UP');
  }

  /** Validation messages have no testID in this app, so they are found by text (priority 3). */
  validationMessage(text: string) {
    return byText(text);
  }

  async fillCredentials(email: string, password: string) {
    await this.emailInput.setValue(email);
    await this.passwordInput.setValue(password);
    await hideKeyboardIfShown();
  }

  async submitLogin(email: string, password: string) {
    await this.fillCredentials(email, password);
    await tap(this.loginButton);
  }

  async submitSignUp(email: string, password: string) {
    await tap(this.signUpTabButton);
    await this.repeatPasswordInput.waitForDisplayed({ timeout: TIMEOUTS.SHORT });
    await this.fillCredentials(email, password);
    await this.repeatPasswordInput.setValue(password);
    await hideKeyboardIfShown();
    await tap(this.signUpButton);
  }
}

export default new LoginPage();
