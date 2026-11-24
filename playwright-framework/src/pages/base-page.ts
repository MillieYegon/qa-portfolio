import { Locator, Page } from '@playwright/test';

export class BasePage {
  readonly navCartLink: Locator;
  readonly navCartQuantity: Locator;
  readonly navSignInLink: Locator;

  constructor(public readonly page: Page) {
    this.navCartLink = page.getByTestId('nav-cart');
    this.navCartQuantity = page.getByTestId('cart-quantity');
    this.navSignInLink = page.getByTestId('nav-sign-in');
  }

  async goToHome() {
    await this.page.goto('/');
  }
}
