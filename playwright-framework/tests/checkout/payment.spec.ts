import { test, expect } from '../../src/fixtures/fixtures';
import { BANK_TRANSFER, INVALID_CARD, MESSAGES, PRODUCTS } from '../../src/data/test-data';

// Cart and sign-in are seeded through the API, so each test starts at checkout with its own cart.
test.describe('Checkout payment', () => {
  test.beforeEach(async ({ signedIn, seedCart, checkoutPage }) => {
    await seedCart([{ productName: PRODUCTS.combinationPliers, quantity: 2 }]);
    await checkoutPage.openCheckout();
    await expect(checkoutPage.cartProductTitles).toHaveText([PRODUCTS.combinationPliers]);
  });

  test(
    'Verify that paying by bank transfer completes the order and the new invoice appears in the customer invoice list',
    { tag: ['@smoke', '@regression', '@payments', '@TS-301'] },
    async ({ checkoutPage, invoicesPage, api, account }) => {
      const pliers = await api.findProduct(PRODUCTS.combinationPliers);
      const expectedTotal = (pliers.price * 2).toFixed(2);
      await expect(checkoutPage.cartTotalCell).toContainText(expectedTotal);

      await checkoutPage.goToPaymentStep();
      await checkoutPage.fillBankTransfer(BANK_TRANSFER);
      await checkoutPage.finishButton.click();
      await expect(checkoutPage.paymentSuccessMessage).toHaveText(MESSAGES.paymentSuccess);

      await checkoutPage.finishButton.click();
      await expect(checkoutPage.orderConfirmation).toContainText('Your invoice number is INV-');
      const invoiceNumber = (await checkoutPage.orderConfirmation.textContent())?.match(/INV-\d+/)?.[0];
      expect(invoiceNumber, 'confirmation shows an invoice number').toBeTruthy();

      // A success message only proves the request was sent. Check the order really exists,
      // with the right amount and payment method, where the customer would look for it.
      await invoicesPage.openInvoices();
      await expect(invoicesPage.invoiceRow(invoiceNumber!)).toContainText(expectedTotal);
      const invoice = (await api.listInvoices(account.token)).find((i) => i.invoice_number === invoiceNumber);
      expect(invoice?.payment?.payment_method).toBe('bank-transfer');
      expect(invoice?.total).toBeCloseTo(pliers.price * 2, 2);
    },
  );

  test(
    'Verify that an invalid card number, past expiry date and short CVV each show their own error and block payment',
    { tag: ['@regression', '@payments', '@TS-302'] },
    async ({ checkoutPage }) => {
      await checkoutPage.goToPaymentStep();
      await checkoutPage.fillCard(INVALID_CARD);

      await expect(checkoutPage.paymentErrorAlerts.filter({ hasText: MESSAGES.invalidCardNumber })).toBeVisible();
      await expect(checkoutPage.paymentErrorAlerts.filter({ hasText: MESSAGES.expiryInPast })).toBeVisible();
      await expect(checkoutPage.paymentErrorAlerts.filter({ hasText: MESSAGES.invalidCvv })).toBeVisible();
      await expect(checkoutPage.finishButton).toBeDisabled();
    },
  );

  test(
    'Verify that the payment step lists every supported payment method for a signed-in customer',
    { tag: ['@regression', '@payments', '@TS-303'] },
    async ({ checkoutPage }) => {
      await checkoutPage.goToPaymentStep();

      const options = await checkoutPage.paymentMethodDropdown.locator('option').evaluateAll((els) =>
        els.map((el) => (el as HTMLOptionElement).value).filter(Boolean),
      );
      expect(options).toEqual(['bank-transfer', 'cash-on-delivery', 'credit-card', 'buy-now-pay-later', 'gift-card']);
    },
  );
});
