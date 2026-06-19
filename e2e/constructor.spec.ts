import { expect, test, type Locator, type Page } from '@playwright/test';

type TTestIngredient = {
  _id: string;
  __v: number;
  calories: number;
  carbohydrates: number;
  fat: number;
  image: string;
  image_large: string;
  image_mobile: string;
  name: string;
  price: number;
  proteins: number;
  type: 'bun' | 'main' | 'sauce';
};

const bun: TTestIngredient = {
  _id: 'bun-1',
  __v: 0,
  calories: 420,
  carbohydrates: 53,
  fat: 24,
  image: 'https://example.com/bun.png',
  image_large: 'https://example.com/bun-large.png',
  image_mobile: 'https://example.com/bun-mobile.png',
  name: 'Космическая булка',
  price: 125,
  proteins: 80,
  type: 'bun',
};

const main: TTestIngredient = {
  _id: 'main-1',
  __v: 0,
  calories: 300,
  carbohydrates: 10,
  fat: 20,
  image: 'https://example.com/main.png',
  image_large: 'https://example.com/main-large.png',
  image_mobile: 'https://example.com/main-mobile.png',
  name: 'Метеоритная котлета',
  price: 80,
  proteins: 40,
  type: 'main',
};

const sauce: TTestIngredient = {
  _id: 'sauce-1',
  __v: 0,
  calories: 90,
  carbohydrates: 12,
  fat: 5,
  image: 'https://example.com/sauce.png',
  image_large: 'https://example.com/sauce-large.png',
  image_mobile: 'https://example.com/sauce-mobile.png',
  name: 'Галактический соус',
  price: 20,
  proteins: 5,
  type: 'sauce',
};

const orderNumber = 12345;
const accessToken = 'Bearer test-access-token';
const refreshToken = 'test-refresh-token';

test.describe.configure({ timeout: 60_000 });

const dragAndDrop = async (
  page: Page,
  source: Locator,
  target: Locator
): Promise<void> => {
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());

  await source.dispatchEvent('dragstart', { dataTransfer });
  await target.dispatchEvent('dragenter', { dataTransfer });
  await target.dispatchEvent('dragover', { dataTransfer });
  await target.dispatchEvent('drop', { dataTransfer });
  await source.dispatchEvent('dragend', { dataTransfer });
};

test('пользователь может собрать бургер, оформить заказ и открыть модальные окна в конструкторе', async ({
  page,
}) => {
  await page.addInitScript(
    ([nextAccessToken, nextRefreshToken]) => {
      window.localStorage.setItem('accessToken', nextAccessToken);
      window.localStorage.setItem('refreshToken', nextRefreshToken);
    },
    [accessToken, refreshToken]
  );

  await page.routeFromHAR('./e2e/fixtures/constructor-api.har', {
    notFound: 'fallback',
    url: '**/api/**',
  });

  await page.goto('/');

  const bunCard = page.getByTestId(`ingredient-card-${bun._id}`);
  const mainCard = page.getByTestId(`ingredient-card-${main._id}`);
  const sauceCard = page.getByTestId(`ingredient-card-${sauce._id}`);
  const constructorDropzone = page.getByTestId('constructor-dropzone');
  const constructorIngredients = page.getByTestId('constructor-ingredients');
  const orderButton = page.getByTestId('create-order-button');
  const modal = page.getByTestId('modal');

  await expect(bunCard).toBeVisible();
  await expect(mainCard).toBeVisible();
  await expect(sauceCard).toBeVisible();

  await bunCard.click();
  await expect(page).toHaveURL(new RegExp(`/ingredients/${bun._id}$`));
  await expect(modal).toBeVisible();
  await expect(modal).toContainText(bun.name);
  await expect(modal.getByAltText(bun.name)).toBeVisible();
  await expect(modal).toContainText('Калории, ккал');
  await expect(modal).toContainText(String(bun.calories));
  await expect(modal).toContainText('Белки, г');
  await expect(modal).toContainText(String(bun.proteins));
  await expect(modal).toContainText('Жиры, г');
  await expect(modal).toContainText(String(bun.fat));
  await expect(modal).toContainText('Углеводы, г');
  await expect(modal).toContainText(String(bun.carbohydrates));

  await page.getByTestId('modal-close-button').click();
  await expect(page).toHaveURL('/');
  await expect(modal).toHaveCount(0);

  await dragAndDrop(page, bunCard, constructorDropzone);
  await dragAndDrop(page, mainCard, constructorDropzone);
  await dragAndDrop(page, sauceCard, constructorDropzone);

  await expect(constructorIngredients.getByTestId('constructor-item')).toHaveCount(2);
  await expect(constructorIngredients).toContainText(main.name);
  await expect(constructorIngredients).toContainText(sauce.name);

  const constructorItems = constructorIngredients.getByTestId('constructor-item');
  await dragAndDrop(
    page,
    constructorItems.filter({ hasText: sauce.name }),
    constructorItems.filter({ hasText: main.name })
  );

  await expect(constructorItems.nth(0)).toContainText(sauce.name);
  await expect(constructorItems.nth(1)).toContainText(main.name);
  await expect(page.getByText('350', { exact: true })).toBeVisible();

  const orderRequestPromise = page.waitForRequest(
    (request) => request.url().endsWith('/api/orders') && request.method() === 'POST'
  );

  await orderButton.click();

  const orderRequest = await orderRequestPromise;
  expect(orderRequest.postDataJSON()).toEqual({
    ingredients: [bun._id, sauce._id, main._id, bun._id],
  });

  await expect(modal).toBeVisible();
  await expect(modal).toContainText(String(orderNumber));
  await expect(constructorIngredients.getByTestId('constructor-item')).toHaveCount(0);
  await expect(orderButton).toBeDisabled();

  await page.getByTestId('modal-close-button').click();
  await expect(modal).toHaveCount(0);
});
