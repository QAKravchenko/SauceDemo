# SauceDemo Playwright Tests (Page Object Model & Fixtures)

## Структура тестів

- **Початкові тести (без фікстур):** `tests/saucedemo.spec.ts`
- **Фікстури (`base.extend`):** `tests/fixtures/fixtures.ts`
- **Нові версії тестів (з фікстурами):** `tests/with-fixtures/saucedemo.spec.ts`
- **Page Objects:** `pages/` (`LoginPage.ts`, `InventoryPage.ts`, `CartPage.ts`, `CheckoutStepOnePage.ts`, `CheckoutStepTwoPage.ts`)

## Встановлення

```bash
npm ci
npx playwright install --with-deps
```

## Запуск тестів

Запустити **лише нову папку тестів із фікстурами**:

```bash
npx playwright test tests/with-fixtures
# або
npm run test:fixtures
```

Запустити **всі тести проєкту** (початкові + з фікстурами):

```bash
npx playwright test
```

## Звіт

```bash
npx playwright show-report
```
