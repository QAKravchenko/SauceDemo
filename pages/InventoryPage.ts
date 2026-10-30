import { type Page, type Locator } from '@playwright/test';

/**
 * 2. Каталог товарів — InventoryPage
 * Адреса: https://www.saucedemo.com/inventory.html
 */
export class InventoryPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly inventoryContainer: Locator;
  readonly inventoryItems: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  /**
   * Повертає локатор картки товару в каталозі за його точною назвою
   */
  getProductItemByTitle(title: string): Locator {
    return this.inventoryItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: title }),
    });
  }

  /**
   * Додає в кошик товар із переданою назвою
   */
  async addToCartByTitle(title: string): Promise<void> {
    const productCard = this.getProductItemByTitle(title);
    await productCard.getByRole('button', { name: 'Add to cart' }).click();
  }

  /**
   * Видаляє з кошика товар із переданою назвою через каталог
   */
  async removeFromCartByTitle(title: string): Promise<void> {
    const productCard = this.getProductItemByTitle(title);
    await productCard.getByRole('button', { name: 'Remove' }).click();
  }

  /**
   * Повертає ціну товару з переданою назвою (наприклад, "$29.99")
   */
  async getPriceByTitle(title: string): Promise<string> {
    const productCard = this.getProductItemByTitle(title);
    const priceText = await productCard.locator('[data-test="inventory-item-price"]').innerText();
    return priceText.trim();
  }

  /**
   * Відкриває сторінку кошика
   */
  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  /**
   * Повертає кількість товарів на значку кошика (0, якщо значок прихований)
   */
  async getCartItemsCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      const badgeText = await this.cartBadge.innerText();
      return Number(badgeText.trim());
    }
    return 0;
  }

  /**
   * Сортує товари за вибраною опцією ('az' | 'za' | 'lohi' | 'hilo')
   */
  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }
}
