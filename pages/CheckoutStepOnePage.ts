import { type Page, type Locator } from '@playwright/test';

/**
 * 4. Дані покупця — CheckoutStepOnePage
 * Адреса: https://www.saucedemo.com/checkout-step-one.html
 */
export class CheckoutStepOnePage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.zipCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /**
   * Заповнює ім'я переданим значенням
   */
  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  /**
   * Заповнює прізвище переданим значенням
   */
  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  /**
   * Заповнює поштовий індекс переданим значенням
   */
  async fillZipCode(zipCode: string): Promise<void> {
    await this.zipCodeInput.fill(zipCode);
  }

  /**
   * Натискає кнопку продовження; з коректно заповненими даними переходить до другого кроку
   */
  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  /**
   * Скасовує введення даних та повертає до кошика
   */
  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
