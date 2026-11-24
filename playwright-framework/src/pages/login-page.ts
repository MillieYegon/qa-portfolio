import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginSubmitButton: Locator;
  readonly loginErrorMessage: Locator;
  readonly accountPageHeading: Locator;

  constructor(public readonly page: Page) {
    super(page);
    this.emailInput = page.getByTestId('email');
    this.passwordInput = page.getByTestId('password');
    this.loginSubmitButton = page.getByTestId('login-submit');
    this.loginErrorMessage = page.getByTestId('login-error');
    this.accountPageHeading = page.getByTestId('page-title');
  }

  async goToLogin() {
    await this.page.goto('/auth/login');
  }

  async fillAndSubmitLogin(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginSubmitButton.click();
  }
}
