import { describe, expect, it, vi, beforeEach } from 'vitest';

const burgerApiMocks = vi.hoisted(() => ({
  clearTokens: vi.fn(),
  getAccessToken: vi.fn(() => 'access-token'),
  getRefreshToken: vi.fn(() => 'refresh-token'),
  getUserApi: vi.fn(),
  loginUserApi: vi.fn(),
  logoutUserApi: vi.fn(),
  registerUserApi: vi.fn(),
  saveTokens: vi.fn(),
  updateUserApi: vi.fn(),
}));

vi.mock('@services/burger-api', () => burgerApiMocks);

import {
  authReducer,
  checkUserAuth,
  clearAuthError,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from './auth-slice';

describe('Редьюсер авторизации', () => {
  const user = {
    email: 'test@example.com',
    name: 'Test User',
  };

  const authResponse = {
    success: true,
    user,
    accessToken: 'new-access-token',
    refreshToken: 'new-refresh-token',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    burgerApiMocks.getAccessToken.mockReturnValue('access-token');
    burgerApiMocks.getRefreshToken.mockReturnValue('refresh-token');
  });

  it('возвращает начальное состояние', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      accessToken: 'access-token',
      error: null,
      isAuthChecked: false,
      isLoading: false,
      refreshToken: 'refresh-token',
      user: null,
    });
  });

  it('очищает ошибку авторизации', () => {
    const state = authReducer(
      {
        accessToken: 'access-token',
        error: 'Ошибка',
        isAuthChecked: false,
        isLoading: false,
        refreshToken: 'refresh-token',
        user: null,
      },
      clearAuthError()
    );

    expect(state.error).toBeNull();
  });

  it('сбрасывает ошибку при проверке авторизации', () => {
    const state = authReducer(
      {
        accessToken: 'access-token',
        error: 'Ошибка',
        isAuthChecked: false,
        isLoading: false,
        refreshToken: 'refresh-token',
        user: null,
      },
      checkUserAuth.pending('request-id')
    );

    expect(state.error).toBeNull();
  });

  it('сохраняет пользователя после успешной проверки авторизации', () => {
    const state = authReducer(
      undefined,
      checkUserAuth.fulfilled(user, 'request-id', undefined)
    );

    expect(state.user).toEqual(user);
    expect(state.isAuthChecked).toBe(true);
  });

  it('сбрасывает пользователя и токены после неудачной проверки авторизации', () => {
    const state = authReducer(
      {
        accessToken: 'access-token',
        error: null,
        isAuthChecked: false,
        isLoading: false,
        refreshToken: 'refresh-token',
        user,
      },
      checkUserAuth.rejected(
        new Error('fail'),
        'request-id',
        undefined,
        'Сессия истекла'
      )
    );

    expect(state).toEqual({
      accessToken: null,
      error: 'Сессия истекла',
      isAuthChecked: true,
      isLoading: false,
      refreshToken: null,
      user: null,
    });
  });

  it('включает загрузку при начале регистрации', () => {
    const state = authReducer(
      undefined,
      registerUser.pending('request-id', {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      })
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('сохраняет пользователя и токены после успешной регистрации', () => {
    const state = authReducer(
      undefined,
      registerUser.fulfilled(authResponse, 'request-id', {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
      })
    );

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(user);
    expect(state.accessToken).toBe('new-access-token');
    expect(state.refreshToken).toBe('new-refresh-token');
    expect(burgerApiMocks.saveTokens).toHaveBeenCalledWith(
      'new-access-token',
      'new-refresh-token'
    );
  });

  it('сохраняет ошибку после неудачной регистрации', () => {
    const state = authReducer(
      {
        accessToken: 'access-token',
        error: null,
        isAuthChecked: false,
        isLoading: true,
        refreshToken: 'refresh-token',
        user: null,
      },
      registerUser.rejected(
        new Error('fail'),
        'request-id',
        {
          email: 'test@example.com',
          name: 'Test User',
          password: 'password',
        },
        'Не удалось зарегистрироваться'
      )
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось зарегистрироваться');
  });

  it('включает загрузку при начале входа', () => {
    const state = authReducer(
      undefined,
      loginUser.pending('request-id', {
        email: 'test@example.com',
        password: 'password',
      })
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('сохраняет пользователя и токены после успешного входа', () => {
    const state = authReducer(
      undefined,
      loginUser.fulfilled(authResponse, 'request-id', {
        email: 'test@example.com',
        password: 'password',
      })
    );

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(user);
    expect(state.accessToken).toBe('new-access-token');
    expect(state.refreshToken).toBe('new-refresh-token');
    expect(burgerApiMocks.saveTokens).toHaveBeenCalledWith(
      'new-access-token',
      'new-refresh-token'
    );
  });

  it('сохраняет ошибку после неудачного входа', () => {
    const state = authReducer(
      {
        accessToken: 'access-token',
        error: null,
        isAuthChecked: false,
        isLoading: true,
        refreshToken: 'refresh-token',
        user: null,
      },
      loginUser.rejected(
        new Error('fail'),
        'request-id',
        {
          email: 'test@example.com',
          password: 'password',
        },
        'Не удалось выполнить вход'
      )
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось выполнить вход');
  });

  it('включает загрузку при начале обновления профиля', () => {
    const state = authReducer(
      undefined,
      updateUser.pending('request-id', {
        email: 'test@example.com',
        name: 'Test User',
      })
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обновляет данные пользователя после успешного запроса', () => {
    const nextUser = {
      email: 'new@example.com',
      name: 'Updated User',
    };

    const state = authReducer(
      undefined,
      updateUser.fulfilled(nextUser, 'request-id', {
        email: 'new@example.com',
        name: 'Updated User',
      })
    );

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(nextUser);
  });

  it('сохраняет ошибку после неудачного обновления профиля', () => {
    const state = authReducer(
      {
        accessToken: 'access-token',
        error: null,
        isAuthChecked: false,
        isLoading: true,
        refreshToken: 'refresh-token',
        user,
      },
      updateUser.rejected(
        new Error('fail'),
        'request-id',
        {
          email: 'test@example.com',
          name: 'Test User',
        },
        'Не удалось обновить профиль'
      )
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось обновить профиль');
  });

  it('включает загрузку при начале выхода из аккаунта', () => {
    const state = authReducer(undefined, logoutUser.pending('request-id'));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('сбрасывает пользователя и токены после успешного выхода', () => {
    const state = authReducer(
      {
        accessToken: 'access-token',
        error: null,
        isAuthChecked: true,
        isLoading: true,
        refreshToken: 'refresh-token',
        user,
      },
      logoutUser.fulfilled(undefined, 'request-id', undefined)
    );

    expect(state).toEqual({
      accessToken: null,
      error: null,
      isAuthChecked: true,
      isLoading: false,
      refreshToken: null,
      user: null,
    });
  });

  it('сохраняет ошибку после неудачного выхода из аккаунта', () => {
    const state = authReducer(
      {
        accessToken: 'access-token',
        error: null,
        isAuthChecked: true,
        isLoading: true,
        refreshToken: 'refresh-token',
        user,
      },
      logoutUser.rejected(
        new Error('fail'),
        'request-id',
        undefined,
        'Не удалось выйти из аккаунта'
      )
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось выйти из аккаунта');
  });
});
