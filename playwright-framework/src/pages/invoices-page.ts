import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class InvoicesPage extends BasePage {
  readonly invoiceRows: Locator;

  constructor(public readonly page: Page) {
    super(page);
    this.invoiceRows = page.locator('table tbody tr'); // structural: invoice rows carry no data-test
  }

  async openInvoices() {
    await this.page.goto('/account/invoices');
  }

  invoiceRow(invoiceNumber: string): Locator {
    return this.invoiceRows.filter({ hasText: invoiceNumber });
  }
}
