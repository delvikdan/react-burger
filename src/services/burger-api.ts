import { BURGER_API_URL } from '@utils/constants';

import type { TIngredient } from '@utils/types';

type TBaseApiResponse = {
  success: boolean;
};

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
    throw new Error(`Ошибка ${response.status}`);
  }

  return (await response.json()) as T;
};

const checkSuccess = <T extends TBaseApiResponse>(data: T): T => {
  if (!data.success) {
    throw new Error('Ответ не success');
  }

  return data;
};

const request = async <T extends TBaseApiResponse>(
  endpoint: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${BURGER_API_URL}${endpoint}`, options);
  const data = await checkResponse<T>(response);

  return checkSuccess(data);
};

export const fetchIngredientsApi = async (): Promise<TIngredient[]> => {
  const data = await request<TIngredientsApiResponse>('/ingredients');

  return data.data;
};

export const createOrderApi = async ({
  ingredients,
}: TCreateOrderRequest): Promise<number> => {
  const data = await request<TCreateOrderApiResponse>('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  });

  return data.order.number;
};
