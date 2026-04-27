import { BURGER_API_URL } from '@utils/constants';

import type { TIngredient } from '@utils/types';

type TIngredientsApiResponse = {
  success: boolean;
  data: TIngredient[];
};

type TCreateOrderRequest = {
  ingredients: string[];
};

type TCreateOrderApiResponse = {
  success: boolean;
  order: {
    number: number;
  };
};

const checkResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status}`);
  }

  return (await response.json()) as T;
};

export const fetchIngredientsApi = async (): Promise<TIngredient[]> => {
  const response = await fetch(`${BURGER_API_URL}/ingredients`);
  const data = await checkResponse<TIngredientsApiResponse>(response);

  if (!data.success) {
    throw new Error('Не удалось получить ингредиенты');
  }

  return data.data;
};

export const createOrderApi = async ({
  ingredients,
}: TCreateOrderRequest): Promise<number> => {
  const response = await fetch(`${BURGER_API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  });
  const data = await checkResponse<TCreateOrderApiResponse>(response);

  if (!data.success) {
    throw new Error('Не удалось оформить заказ');
  }

  return data.order.number;
};
