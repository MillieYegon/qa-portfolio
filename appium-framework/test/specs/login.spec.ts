import LoginPage from '../pageobjects/login.page';
import { MESSAGES, VALID_USER } from '../data/test-data';
import { tap } from '../helpers/gestures';

describe('Login and sign up', () => {
  beforeEach(async () => {
    await LoginPage.openTab('Login');
  });

  it('Verify that logging in with a valid email and an 8-character password shows the logged-in dialog @smoke @TS-401', async () => {
    await LoginPage.submitLogin(VALID_USER.email, VALID_USER.password);

    await expect(LoginPage.dialogMessage).toHaveText(MESSAGES.loggedIn);
    await LoginPage.dismissDialog();
  });

  it('Verify that submitting the login form empty shows both the email and password validation messages @TS-402', async () => {
    await LoginPage.emailInput.clearValue();
    await LoginPage.passwordInput.clearValue();
    await tap(LoginPage.loginButton);

    await expect(LoginPage.validationMessage(MESSAGES.invalidEmail)).toBeDisplayed();
    await expect(LoginPage.validationMessage(MESSAGES.shortPassword)).toBeDisplayed();
  });

  it('Verify that signing up with a valid email and matching passwords shows the signed-up dialog @smoke @TS-403', async () => {
    await LoginPage.submitSignUp(VALID_USER.email, VALID_USER.password);

    await expect(LoginPage.dialogMessage).toHaveText(MESSAGES.signedUp);
    await LoginPage.dismissDialog();
  });
});
