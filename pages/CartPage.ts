import { type Page, type Locator } from '@playwright/test';

/**
 * 3. Кошик — CartPage
 * Адреса: https://www.saucedemo.com/cart.html
 */
export class CartPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  /**
   * Повертає локатор картки товару в кошику за його назвою
   */
  getCartItemByTitle(title: string): Locator {
    return this.cartItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: title }),
    });
  }

  /**
   * Видаляє з кошика товар із переданою назвою
   */
  async removeFromCartByTitle(title: string): Promise<void> {
    const cartItem = this.getCartItemByTitle(title);
    await cartItem.getByRole('button', { name: 'Remove' }).click();
  }

  /**
   * Повертає ціну товару з переданою назвою в кошику (наприклад, "$29.99")
   */
  async getPriceByTitle(title: string): Promise<string> {
    const cartItem = this.getCartItemByTitle(title);
    const priceText = await cartItem.locator('[data-test="inventory-item-price"]').innerText();
    return priceText.trim();
  }

  /**
   * Переходить до першого кроку оформлення замовлення
   */
  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Повертається до каталогу товарів
   */
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
