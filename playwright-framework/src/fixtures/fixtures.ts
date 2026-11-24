import { test as base, expect, request as playwrightRequest } from '@playwright/test';
import { ToolshopApi } from '../api/toolshop-api';
import { TestUser } from '../data/user-factory';
import { CataloguePage } from '../pages/catalogue-page';
import { CheckoutPage } from '../pages/checkout-page';
import { InvoicesPage } from '../pages/invoices-page';
import { LoginPage } from '../pages/login-page';

interface WorkerAccount {
  user: TestUser;
  token: string;
}

interface WorkerFixtures {
  workerApi: ToolshopApi;
  account: WorkerAccount;
}

interface TestFixtures {
  api: ToolshopApi;
  signedIn: void;
  seedCart: (items: { productName: string; quantity: number }[]) => Promise<void>;
  loginPage: LoginPage;
  cataloguePage: CataloguePage;
  checkoutPage: CheckoutPage;
  invoicesPage: InvoicesPage;
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  // One API client per worker, shared by its tests.
  workerApi: [
    async ({}, use) => {
      const context = await playwrightRequest.newContext();
      await use(new ToolshopApi(context));
      await context.dispose();
    },
    { scope: 'worker' },
  ],

  // Worker isolation: each worker registers its own customer once, so parallel tests never
  // share a cart, an order history or a session.
  account: [
    async ({ workerApi }, use, workerInfo) => {
      const user = new TestUser(`w${workerInfo.parallelIndex}`);
      await workerApi.registerUser(user);
      const token = await workerApi.login(user.email, user.password);
      await use({ user, token });
    },
    { scope: 'worker' },
  ],

  api: async ({ workerApi }, use) => {
    await use(workerApi);
  },

  // Signs the browser in by placing the worker's API token where the app keeps it,
  // so only the login spec spends time on the login form.
  signedIn: async ({ page, account }, use) => {
    await page.addInitScript((token) => window.localStorage.setItem('auth-token', token), account.token);
    await use();
  },

  // Seeds a fresh cart through the API and hands it to the browser. A new cart per test
  // keeps tests in the same worker independent of each other.
  seedCart: async ({ page, api }, use) => {
    await use(async (items) => {
      const resolved = await Promise.all(
        items.map(async (item) => ({ productId: (await api.findProduct(item.productName)).id, quantity: item.quantity })),
      );
      const cartId = await api.createCartWith(resolved);
      const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
      await page.addInitScript(
        ({ id, count }) => {
          window.sessionStorage.setItem('cart_id', id);
          window.sessionStorage.setItem('cart_quantity', String(count));
        },
        { id: cartId, count: quantity },
      );
    });
  },

  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  cataloguePage: async ({ page }, use) => use(new CataloguePage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  invoicesPage: async ({ page }, use) => use(new InvoicesPage(page)),
});

export { expect };
