import { type Page, type Locator } from '@playwright/test';

/**
 * 5. Перевірка замовлення — CheckoutStepTwoPage
 * Адреса: https://www.saucedemo.com/checkout-step-two.html
 */
export class CheckoutStepTwoPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly summaryItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.summaryItems = page.locator('[data-test="inventory-item"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  /**
   * Повертає локатор товару в списку перевірки замовлення за його назвою
   */
  getItemByTitle(title: string): Locator {
    return this.summaryItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: title }),
    });
  }

  /**
   * Повертає ціну товару за його назвою на сторінці огляду замовлення (наприклад, "$29.99")
   */
  async getPriceByTitle(title: string): Promise<string> {
    const item = this.getItemByTitle(title);
    const priceText = await item.locator('[data-test="inventory-item-price"]').innerText();
    return priceText.trim();
  }

  /**
   * Повертає суму замовлення без податку (наприклад, "$29.99")
   */
  async getSubtotal(): Promise<string> {
    const text = await this.subtotalLabel.innerText();
    return text.replace('Item total:', '').trim();
  }

  /**
   * Повертає суму податку (наприклад, "$2.40")
   */
  async getTax(): Promise<string> {
    const text = await this.taxLabel.innerText();
    return text.replace('Tax:', '').trim();
  }

  /**
   * Повертає підсумкову суму замовлення з податком (наприклад, "$32.39")
   */
  async getTotal(): Promise<string> {
    const text = await this.totalLabel.innerText();
    return text.replace('Total:', '').trim();
  }

  /**
   * Завершує оформлення замовлення (натискає кнопку Finish)
   */
  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  /**
   * Скасовує оформлення замовлення (натискає кнопку Cancel)
   */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  /**
   * Повертає текст заголовка після успішного оформлення замовлення
   */
  async getCompleteHeaderText(): Promise<string> {
    const text = await this.completeHeader.innerText();
    return text.trim();
  }
}
