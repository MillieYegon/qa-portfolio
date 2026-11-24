import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../playwright.config';
import { TestUser } from '../data/user-factory';

export interface Product {
  id: string;
  name: string;
  price: number;
  in_stock: boolean;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  total: number;
  payment?: { payment_method: string };
}

/**
 * Thin client for the parts of the Toolshop API that tests use for setup.
 * Setup goes through the API so specs spend their time on the behaviour under test,
 * not on clicking through registration and carts.
 */
export class ToolshopApi {
  constructor(private readonly request: APIRequestContext) {}

  async registerUser(user: TestUser): Promise<void> {
    await this.send('register user', () =>
      this.request.post(`${API_BASE_URL}/users/register`, { data: user.toRegistrationPayload() }),
    );
  }

  async login(email: string, password: string): Promise<string> {
    const response = await this.send('log in', () =>
      this.request.post(`${API_BASE_URL}/users/login`, { data: { email, password } }),
    );
    const { access_token: token } = await response.json();
    if (!token) throw new Error('Login succeeded but returned no access token');
    return token;
  }

  async findProduct(name: string): Promise<Product> {
    const response = await this.send(`search for "${name}"`, () =>
      this.request.get(`${API_BASE_URL}/products/search`, { params: { q: name } }),
    );
    const { data } = await response.json();
    const product = (data as Product[]).find((p) => p.name === name);
    if (!product) throw new Error(`No product named exactly "${name}"`);
    return product;
  }

  async createCartWith(items: { productId: string; quantity: number }[]): Promise<string> {
    const response = await this.send('create cart', () => this.request.post(`${API_BASE_URL}/carts`));
    const { id: cartId } = await response.json();
    for (const item of items) {
      await this.send(`add ${item.productId} to cart`, () =>
        this.request.post(`${API_BASE_URL}/carts/${cartId}`, {
          data: { product_id: item.productId, quantity: item.quantity },
        }),
      );
    }
    return cartId;
  }

  async listInvoices(token: string): Promise<Invoice[]> {
    const response = await this.send('list invoices', () =>
      this.request.get(`${API_BASE_URL}/invoices`, { headers: { Authorization: `Bearer ${token}` } }),
    );
    return (await response.json()).data as Invoice[];
  }

  /**
   * Retries transient failures with jittered backoff, and fails loudly with the status
   * and body otherwise, so a broken setup never looks like a product bug.
   * Response bodies are logged; request headers (which carry the token) are not.
   */
  private async send(label: string, call: () => Promise<APIResponse>, attempts = 3): Promise<APIResponse> {
    for (let attempt = 1; ; attempt++) {
      const response = await call();
      if (response.ok()) return response;
      const retryable = response.status() === 429 || response.status() >= 500;
      if (!retryable || attempt === attempts) {
        throw new Error(`API setup failed to ${label}: ${response.status()} ${(await response.text()).slice(0, 300)}`);
      }
      const backoff = 500 * 2 ** (attempt - 1) + Math.floor(Math.random() * 250);
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }
}
