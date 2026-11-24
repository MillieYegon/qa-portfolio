import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export type PaymentMethod = 'bank-transfer' | 'cash-on-delivery' | 'credit-card' | 'buy-now-pay-later' | 'gift-card';

export class CheckoutPage extends BasePage {
  readonly cartProductTitles: Locator;
  readonly cartTotalCell: Locator;
  readonly cartProceedButton: Locator;
  readonly signedInProceedButton: Locator;
  readonly houseNumberInput: Locator;
  readonly postalCodeInput: Locator;
  readonly streetInput: Locator;
  readonly addressProceedButton: Locator;
  readonly paymentMethodDropdown: Locator;
  readonly bankNameInput: Locator;
  readonly accountNameInput: Locator;
  readonly accountNumberInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cardExpiryInput: Locator;
  readonly cardCvvInput: Locator;
  readonly cardHolderNameInput: Locator;
  readonly finishButton: Locator;
  readonly paymentSuccessMessage: Locator;
  readonly paymentErrorAlerts: Locator;
  readonly orderConfirmation: Locator;

  constructor(public readonly page: Page) {
    super(page);
    this.cartProductTitles = page.getByTestId('product-title');
    this.cartTotalCell = page.getByTestId('cart-total');
    this.cartProceedButton = page.getByTestId('proceed-1');
    this.signedInProceedButton = page.getByTestId('proceed-2');
    this.houseNumberInput = page.getByTestId('house_number');
    this.postalCodeInput = page.getByTestId('postal_code');
    this.streetInput = page.getByTestId('street');
    this.addressProceedButton = page.getByTestId('proceed-3');
    this.paymentMethodDropdown = page.getByTestId('payment-method');
    this.bankNameInput = page.getByTestId('bank_name');
    this.accountNameInput = page.getByTestId('account_name');
    this.accountNumberInput = page.getByTestId('account_number');
    this.cardNumberInput = page.getByTestId('credit_card_number');
    this.cardExpiryInput = page.getByTestId('expiration_date');
    this.cardCvvInput = page.getByTestId('cvv');
    this.cardHolderNameInput = page.getByTestId('card_holder_name');
    this.finishButton = page.getByTestId('finish');
    this.paymentSuccessMessage = page.getByTestId('payment-success-message');
    this.paymentErrorAlerts = page.locator('.alert-danger'); // class selector: validation alerts carry no data-test
    this.orderConfirmation = page.locator('#order-confirmation'); // id selector: confirmation panel carries no data-test
  }

  async openCheckout() {
    await this.page.goto('/checkout');
  }

  /**
   * Cart → signed-in step → billing address, ending on the payment step.
   * The app fills the saved address in after the form renders, and that overwrites anything
   * typed earlier, so wait for the street to arrive before typing.
   */
  async goToPaymentStep(address = { postalCode: '100001', houseNumber: '12' }) {
    await this.cartProceedButton.click();
    await this.signedInProceedButton.click();
    await this.page.waitForFunction(
      (el) => (el as HTMLInputElement | null)?.value !== '',
      await this.streetInput.elementHandle(),
    );
    await this.postalCodeInput.fill(address.postalCode);
    await this.houseNumberInput.fill(address.houseNumber);
    await this.addressProceedButton.click();
  }

  async fillBankTransfer(details: { bankName: string; accountName: string; accountNumber: string }) {
    await this.paymentMethodDropdown.selectOption('bank-transfer');
    await this.bankNameInput.fill(details.bankName);
    await this.accountNameInput.fill(details.accountName);
    await this.accountNumberInput.fill(details.accountNumber);
  }

  async fillCard(card: { number: string; expiry: string; cvv: string; holder: string }) {
    await this.paymentMethodDropdown.selectOption('credit-card');
    await this.cardNumberInput.fill(card.number);
    await this.cardExpiryInput.fill(card.expiry);
    await this.cardCvvInput.fill(card.cvv);
    await this.cardHolderNameInput.fill(card.holder);
    await this.cardHolderNameInput.blur();
  }
}
