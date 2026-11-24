import { test, expect } from '../../src/fixtures/fixtures';
import { MESSAGES } from '../../src/data/test-data';

test.describe('Sign in', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goToLogin();
  });

  test(
    'Verify that a registered customer who signs in with the right password lands on their account page',
    { tag: ['@smoke', '@regression', '@auth', '@TS-101'] },
    async ({ loginPage, account }) => {
      await loginPage.fillAndSubmitLogin(account.user.email, account.user.password);

      await expect(loginPage.page).toHaveURL(/\/account$/);
      await expect(loginPage.accountPageHeading).toHaveText('My account');
    },
  );

  test(
    'Verify that signing in with a wrong password shows an error and keeps the customer on the sign-in page',
    { tag: ['@regression', '@auth', '@TS-102'] },
    async ({ loginPage, account }) => {
      await loginPage.fillAndSubmitLogin(account.user.email, 'not-the-right-password');

      await expect(loginPage.loginErrorMessage).toHaveText(MESSAGES.invalidLogin);
      await expect(loginPage.page).toHaveURL(/\/auth\/login$/);
    },
  );
});
