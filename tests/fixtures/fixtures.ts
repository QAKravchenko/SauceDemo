import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutStepOnePage } from '../../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../pages/CheckoutStepTwoPage';

export type UserCredentials = {
  login: string;
  password: string;
};

export const users: Record<string, UserCredentials> = {
  standard: {
    login: process.env.LOGIN ?? 'standard_user',
    password: process.env.PASSWORD ?? 'secret_sauce',
  },
  visual: {
    login: 'visual_user',
    password: 'secret_sauce',
  },
  problem: {
    login: 'problem_user',
    password: 'secret_sauce',
  },
  lockedOut: {
    login: 'locked_out_user',
    password: 'secret_sauce',
  },
};

type SauceDemoFixtures = {
  userToLogin: UserCredentials;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  login: void;
  logout: void;
};

export const test = base.extend<SauceDemoFixtures>({
  // Користувач за замовчуванням із можливістю перевизначення через test.use({ userToLogin: ... })
  userToLogin: [users.standard, { option: true }],

  // Фікстури об'єктів сторінок (Page Objects)
  loginPage: async ({ page }, use) => {
    console.log('[Fixture] Підготовка LoginPage');
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    console.log('[Fixture] Підготовка InventoryPage');
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  cartPage: async ({ page }, use) => {
    console.log('[Fixture] Підготовка CartPage');
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  checkoutStepOnePage: async ({ page }, use) => {
    console.log('[Fixture] Підготовка CheckoutStepOnePage');
    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    await use(checkoutStepOnePage);
  },

  checkoutStepTwoPage: async ({ page }, use) => {
    console.log('[Fixture] Підготовка CheckoutStepTwoPage');
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    await use(checkoutStepTwoPage);
  },

  // Окрема автоматична фікстура виходу (logout) після кожного тесту
  logout: [
    async ({ inventoryPage }, use) => {
      await use();
      if (await inventoryPage.burgerMenuButton.isVisible()) {
        console.log('[Teardown] Автоматичний вихід із застосунку (logout)');
        await inventoryPage.logout();
      } else {
        console.log('[Teardown] Активна авторизована сесія відсутня — logout пропущено');
      }
    },
    { auto: true },
  ],

  // Автоматична фікстура входу перед кожним тестом
  login: [
    async ({ loginPage, userToLogin }, use) => {
      console.log(`[Setup] Автоматичний вхід користувача: ${userToLogin.login}`);
      await loginPage.open();
      await loginPage.login(userToLogin.login, userToLogin.password);
      await use();
    },
    { auto: true },
  ],
});

export { expect };
