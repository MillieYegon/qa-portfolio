import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class CataloguePage extends BasePage {
  readonly searchQueryInput: Locator;
  readonly searchSubmitButton: Locator;
  readonly sortDropdown: Locator;
  readonly productNameHeadings: Locator;
  readonly productPriceLabels: Locator;
  readonly searchCaption: Locator;
  readonly noResultsMessage: Locator;

  constructor(public readonly page: Page) {
    super(page);
    this.searchQueryInput = page.getByTestId('search-query');
    this.searchSubmitButton = page.getByTestId('search-submit');
    this.sortDropdown = page.getByTestId('sort');
    this.productNameHeadings = page.getByTestId('product-name');
    this.productPriceLabels = page.getByTestId('product-price');
    this.searchCaption = page.getByTestId('search-caption');
    this.noResultsMessage = page.getByTestId('no-results');
  }

  async fillAndSubmitSearch(query: string) {
    await this.searchQueryInput.fill(query);
    await this.searchSubmitButton.click();
  }

  categoryCheckbox(categoryName: string): Locator {
    return this.page.getByRole('checkbox', { name: categoryName, exact: true });
  }

  async readPrices(): Promise<number[]> {
    const labels = await this.productPriceLabels.allTextContents();
    return labels.map((label) => Number(label.replace(/[^0-9.]/g, '')));
  }
}
