import { test, expect } from '../../src/fixtures/fixtures';
import { CATEGORIES, PRODUCTS } from '../../src/data/test-data';

test.describe('Product catalogue', () => {
  test.beforeEach(async ({ cataloguePage }) => {
    await cataloguePage.goToHome();
    await expect(cataloguePage.productNameHeadings.first()).toBeVisible();
  });

  test(
    'Verify that searching by product name shows only products whose names match the search term',
    { tag: ['@smoke', '@regression', '@catalogue', '@TS-201'] },
    async ({ cataloguePage }) => {
      await cataloguePage.fillAndSubmitSearch(PRODUCTS.clawHammer);

      await expect(cataloguePage.searchCaption).toContainText(PRODUCTS.clawHammer);
      // Retrying assertions: the grid re-renders after the caption, so wait for it to settle
      // instead of reading it once.
      await expect(cataloguePage.productNameHeadings.filter({ hasNotText: PRODUCTS.clawHammer })).toHaveCount(0);
      await expect(cataloguePage.productNameHeadings.filter({ hasText: PRODUCTS.clawHammer }).first()).toBeVisible();
    },
  );

  test(
    'Verify that a search with no matching products shows the no-results message instead of an empty grid',
    { tag: ['@regression', '@catalogue', '@TS-202'] },
    async ({ cataloguePage }) => {
      await cataloguePage.fillAndSubmitSearch('zzqq-no-such-tool');

      await expect(cataloguePage.noResultsMessage).toBeVisible();
      await expect(cataloguePage.productNameHeadings).toHaveCount(0);
    },
  );

  test(
    'Verify that sorting by price from low to high lists every product on the page in ascending price order',
    { tag: ['@regression', '@catalogue', '@TS-203'] },
    async ({ cataloguePage }) => {
      const firstPriceBefore = await cataloguePage.productPriceLabels.first().textContent();
      await cataloguePage.sortDropdown.selectOption('price,asc');
      await expect(cataloguePage.productPriceLabels.first()).not.toHaveText(firstPriceBefore ?? '');

      const prices = await cataloguePage.readPrices();
      expect(prices.length).toBeGreaterThan(1);
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    },
  );

  test(
    'Verify that filtering by the Hammer category shows hammers and hides products from other categories',
    { tag: ['@regression', '@catalogue', '@TS-204'] },
    async ({ cataloguePage }) => {
      await cataloguePage.categoryCheckbox(CATEGORIES.hammer).check();

      await expect(cataloguePage.productNameHeadings.filter({ hasNotText: /hammer/i })).toHaveCount(0);
      await expect(cataloguePage.productNameHeadings.filter({ hasText: PRODUCTS.clawHammer }).first()).toBeVisible();
    },
  );
});
