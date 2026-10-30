import { test, expect, users } from '../fixtures/fixtures';

test.describe('SauceDemo — Тестування з фікстурами (standard_user за замовчуванням)', () => {
  test('1. Успішний вхід і відображення каталогу товарів', async ({ page, inventoryPage }) => {
    console.log('[Test] Перевірка відображення каталогу товарів');
    await expect(page).toHaveURL(/.*\/inventory\.html/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
    await expect(inventoryPage.inventoryContainer).toBeVisible();
    await expect(inventoryPage.inventoryItems).toHaveCount(6);
  });

  test('2. Додавання товару та перевірка його назви й ціни в кошику', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    console.log('[Test] Додавання товару та перевірка в кошику');
    const productTitle = 'Sauce Labs Backpack';

    const catalogPrice = await inventoryPage.getPriceByTitle(productTitle);
    expect(catalogPrice).toBe('$29.99');

    await inventoryPage.addToCartByTitle(productTitle);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.openCart();
    await expect(page).toHaveURL(/.*\/cart\.html/);

    const cartItem = cartPage.getCartItemByTitle(productTitle);
    await expect(cartItem).toBeVisible();

    const cartPrice = await cartPage.getPriceByTitle(productTitle);
    expect(cartPrice).toBe(catalogPrice);
  });

  test('3. Видалення товарів через каталог та через кошик', async ({
    inventoryPage,
    cartPage,
  }) => {
    console.log('[Test] Видалення товарів через каталог і кошик');
    const firstProduct = 'Sauce Labs Bike Light';
    const secondProduct = 'Sauce Labs Bolt T-Shirt';

    await inventoryPage.addToCartByTitle(firstProduct);
    await inventoryPage.addToCartByTitle(secondProduct);
    await expect(inventoryPage.cartBadge).toHaveText('2');

    // Видалення першого товару безпосередньо через каталог
    await inventoryPage.removeFromCartByTitle(firstProduct);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    // Перехід у кошик та видалення другого товару з кошика
    await inventoryPage.openCart();
    await expect(cartPage.getCartItemByTitle(secondProduct)).toBeVisible();

    await cartPage.removeFromCartByTitle(secondProduct);
    await expect(cartPage.cartItems).toHaveCount(0);
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('4. Повернення з кошика до каталогу товарів (Continue Shopping)', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    console.log('[Test] Повернення з кошика до каталогу товарів');
    const productTitle = 'Sauce Labs Fleece Jacket';

    await inventoryPage.addToCartByTitle(productTitle);
    await inventoryPage.openCart();
    await expect(page).toHaveURL(/.*\/cart\.html/);
    await expect(cartPage.pageTitle).toHaveText('Your Cart');

    await cartPage.continueShopping();

    await expect(page).toHaveURL(/.*\/inventory\.html/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('5. Повне оформлення замовлення з перевіркою цін і фінального результату', async ({
    page,
    inventoryPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
  }) => {
    console.log('[Test] Повне оформлення замовлення');
    const productTitle = 'Sauce Labs Onesie';

    const catalogPrice = await inventoryPage.getPriceByTitle(productTitle);
    await inventoryPage.addToCartByTitle(productTitle);
    await inventoryPage.openCart();

    await cartPage.checkout();
    await expect(page).toHaveURL(/.*\/checkout-step-one\.html/);

    await checkoutStepOnePage.fillFirstName('Іван');
    await checkoutStepOnePage.fillLastName('Франко');
    await checkoutStepOnePage.fillZipCode('79000');
    await checkoutStepOnePage.continue();

    await expect(page).toHaveURL(/.*\/checkout-step-two\.html/);
    await expect(checkoutStepTwoPage.getItemByTitle(productTitle)).toBeVisible();

    const overviewItemPrice = await checkoutStepTwoPage.getPriceByTitle(productTitle);
    const subtotal = await checkoutStepTwoPage.getSubtotal();
    const total = await checkoutStepTwoPage.getTotal();

    expect(overviewItemPrice).toBe(catalogPrice);
    expect(subtotal).toBe('$7.99');
    expect(total).toBe('$8.63');

    await checkoutStepTwoPage.finish();

    await expect(page).toHaveURL(/.*\/checkout-complete\.html/);
    await expect(checkoutStepTwoPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(checkoutStepTwoPage.completeText).toBeVisible();
  });
});

test.describe('SauceDemo — Тестування під іншим авторизованим користувачем (visual_user)', () => {
  test.use({
    userToLogin: users.visual,
  });

  test('6. Вхід під visual_user, додавання товару в кошик та перевірка', async ({
    page,
    inventoryPage,
    cartPage,
  }) => {
    console.log('[Test] Сценарій для користувача visual_user');
    const productTitle = 'Sauce Labs Bolt T-Shirt';

    await expect(page).toHaveURL(/.*\/inventory\.html/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');

    await inventoryPage.addToCartByTitle(productTitle);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.openCart();
    await expect(cartPage.getCartItemByTitle(productTitle)).toBeVisible();
  });
});

test.describe('SauceDemo — Перевірка відмови у вході для заблокованого користувача (locked_out_user)', () => {
  test.use({
    userToLogin: users.lockedOut,
  });

  test('7. Заблокований користувач отримує повідомлення про помилку входу', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    console.log('[Test] Перевірка відмови у вході для locked_out_user');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
    await expect(inventoryPage.inventoryContainer).toBeHidden();
  });
});
