import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../app/pages/LoginPage/LoginPage';
import { InventoryPage } from '../../app/pages/InventoryPage/InventoryPage';
import { CartPage } from '../../app/pages/CartPage/CartPage';
import { CheckoutPage } from '../../app/pages/CheckoutPage/CheckoutPage';

type MyFixtures = {
  courseName: string;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  testFixture: void;
  login: void;
};
export const users = {
  standard: {
    login: process.env.LOGIN ?? 'standard_user',
    password: process.env.PASSWORD ?? 'secret_sauce',
  },
};

export const products = {
  backpack: 'Sauce Labs Backpack',
};

const test = base.extend<MyFixtures>({
  login: async ({ loginPage, inventoryPage }, use) => {
    await loginPage.gotoLoginPage();
    await loginPage.loginUser(users.standard);

    await inventoryPage.addProductToCart(products.backpack);
    await expect(inventoryPage.locators.cartBadgeLocator).toHaveText('1');

    await use();
  },

  testFixture: async ({ page }, use) => {
    // дії перед тестом
    console.log('1) фікстура стартанула');

    const fx = '2) тест запустився';

    // що ми передаємо в тест
    await use();

    // дії після тесту
    console.log('4) тест завершився');
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);

    await use(inventoryPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);

    await use(cartPage);
  },

  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
});

export { test, expect };
