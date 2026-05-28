import { BURGER_API_URL } from '@utils/constants';

import type { TIngredient } from '@utils/types';

type TBaseApiResponse = {
  success: boolean;
  message?: string;
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

type TRegisterRequest = {
  email: string;
  password: string;
  name: string;
};

type TLoginRequest = {
  email: string;
  password: string;
};

type TLogoutRequest = {
  token: string;
};

type TPasswordResetRequest = {
  email: string;
};

type TPasswordResetConfirmRequest = {
  password: string;
  token: string;
};

type TUpdateUserRequest = {
  email: string;
  name: string;
  password?: string;
};

export type TUser = {
  email: string;
  name: string;
};

export type TAuthApiResponse = {
  success: boolean;
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

type TTokenApiResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

type TMessageApiResponse = {
  success: boolean;
  message: string;
};

type TUserApiResponse = {
  success: boolean;
  user: TUser;
};

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const checkResponse = async <T extends TBaseApiResponse>(
  response: Response
): Promise<T> => {
  const data = (await response.json()) as T;

  if (!response.ok) {
    throw new Error(data.message ?? `Ошибка ${response.status}`);
  }

  return data;
};

const checkSuccess = <T extends TBaseApiResponse>(data: T): T => {
  if (!data.success) {
    throw new Error(data.message ?? 'Ответ не success');
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

const withJsonHeaders = (headers?: HeadersInit): Headers => {
  const result = new Headers(headers);

  if (!result.has('Content-Type')) {
    result.set('Content-Type', 'application/json');
  }

  return result;
};

export const saveTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getAccessToken = (): string | null =>
  localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY);

export const refreshTokenApi = async (): Promise<TTokenApiResponse> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('Токен обновления отсутствует');
  }

  const data = await request<TTokenApiResponse>('/auth/token', {
    method: 'POST',
    headers: withJsonHeaders(),
    body: JSON.stringify({ token: refreshToken }),
  });

  saveTokens(data.accessToken, data.refreshToken);

  return data;
};

export const fetchWithRefresh = async <T extends TBaseApiResponse>(
  endpoint: string,
  options: RequestInit
): Promise<T> => {
  try {
    return await request<T>(endpoint, options);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '';

    if (!message.includes('jwt expired')) {
      throw error;
    }

    const tokenData = await refreshTokenApi();
    const nextHeaders = new Headers(options.headers);

    nextHeaders.set('authorization', tokenData.accessToken);

    return await request<T>(endpoint, {
      ...options,
      headers: nextHeaders,
    });
  }
};

export const fetchIngredientsApi = async (): Promise<TIngredient[]> => {
  const data = await request<TIngredientsApiResponse>('/ingredients');

  return data.data;
};

export const createOrderApi = async ({
  ingredients,
}: TCreateOrderRequest): Promise<number> => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error('Требуется авторизация');
  }

  const data = await fetchWithRefresh<TCreateOrderApiResponse>('/orders', {
    method: 'POST',
    headers: withJsonHeaders({ authorization: accessToken }),
    body: JSON.stringify({ ingredients }),
  });

  return data.order.number;
};

export const registerUserApi = async ({
  email,
  password,
  name,
}: TRegisterRequest): Promise<TAuthApiResponse> =>
  await request<TAuthApiResponse>('/auth/register', {
    method: 'POST',
    headers: withJsonHeaders(),
    body: JSON.stringify({ email, password, name }),
  });

export const loginUserApi = async ({
  email,
  password,
}: TLoginRequest): Promise<TAuthApiResponse> =>
  await request<TAuthApiResponse>('/auth/login', {
    method: 'POST',
    headers: withJsonHeaders(),
    body: JSON.stringify({ email, password }),
  });

export const logoutUserApi = async ({
  token,
}: TLogoutRequest): Promise<TBaseApiResponse> =>
  await request<TBaseApiResponse>('/auth/logout', {
    method: 'POST',
    headers: withJsonHeaders(),
    body: JSON.stringify({ token }),
  });

export const getUserApi = async (): Promise<TUserApiResponse> => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error('Требуется авторизация');
  }

  return await fetchWithRefresh<TUserApiResponse>('/auth/user', {
    method: 'GET',
    headers: withJsonHeaders({ authorization: accessToken }),
  });
};

export const updateUserApi = async ({
  email,
  name,
  password,
}: TUpdateUserRequest): Promise<TUserApiResponse> => {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error('Требуется авторизация');
  }

  return await fetchWithRefresh<TUserApiResponse>('/auth/user', {
    method: 'PATCH',
    headers: withJsonHeaders({ authorization: accessToken }),
    body: JSON.stringify({ email, name, password }),
  });
};

export const requestPasswordResetApi = async ({
  email,
}: TPasswordResetRequest): Promise<TMessageApiResponse> =>
  await request<TMessageApiResponse>('/password-reset', {
    method: 'POST',
    headers: withJsonHeaders(),
    body: JSON.stringify({ email }),
  });

export const resetPasswordApi = async ({
  password,
  token,
}: TPasswordResetConfirmRequest): Promise<TMessageApiResponse> =>
  await request<TMessageApiResponse>('/password-reset/reset', {
    method: 'POST',
    headers: withJsonHeaders(),
    body: JSON.stringify({ password, token }),
  });
