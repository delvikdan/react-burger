import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  getUserApi,
  loginUserApi,
  logoutUserApi,
  registerUserApi,
  saveTokens,
  updateUserApi,
} from '@services/burger-api';

import type { TAuthApiResponse, TUser } from '@services/burger-api';

type TRegisterPayload = {
  email: string;
  password: string;
  name: string;
};

type TLoginPayload = {
  email: string;
  password: string;
};

type TUpdateUserPayload = {
  email: string;
  name: string;
  password: string;
};

type TAuthState = {
  accessToken: string | null;
  error: string | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  refreshToken: string | null;
  user: TUser | null;
};

const initialState: TAuthState = {
  accessToken: getAccessToken(),
  error: null,
  isAuthChecked: false,
  isLoading: false,
  refreshToken: getRefreshToken(),
  user: null,
};

export const checkUserAuth = createAsyncThunk<
  TUser | null,
  void,
  { rejectValue: string }
>('auth/checkUserAuth', async (_, { rejectWithValue }) => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) {
    return null;
  }

  try {
    const data = await getUserApi();
    return data.user;
  } catch (error: unknown) {
    clearTokens();
    const message = error instanceof Error ? error.message : 'Сессия истекла';
    return rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk<
  TAuthApiResponse,
  TRegisterPayload,
  { rejectValue: string }
>('auth/registerUser', async (payload, { rejectWithValue }) => {
  try {
    return await registerUserApi(payload);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Не удалось зарегистрироваться';

    return rejectWithValue(message);
  }
});

export const loginUser = createAsyncThunk<
  TAuthApiResponse,
  TLoginPayload,
  { rejectValue: string }
>('auth/loginUser', async (payload, { rejectWithValue }) => {
  try {
    return await loginUserApi(payload);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Не удалось выполнить вход';

    return rejectWithValue(message);
  }
});

export const updateUser = createAsyncThunk<
  TUser,
  TUpdateUserPayload,
  { rejectValue: string }
>('auth/updateUser', async (payload, { rejectWithValue }) => {
  try {
    const data = await updateUserApi(payload);
    return data.user;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Не удалось обновить профиль';

    return rejectWithValue(message);
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearTokens();
        return;
      }

      await logoutUserApi({ token: refreshToken });
      clearTokens();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Не удалось выйти из аккаунта';

      return rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthChecked = true;
        state.error = action.payload ?? null;
      })
      .addCase(registerUser.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        saveTokens(action.payload.accessToken, action.payload.refreshToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось зарегистрироваться';
      })
      .addCase(loginUser.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        saveTokens(action.payload.accessToken, action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось выполнить вход';
      })
      .addCase(updateUser.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось обновить профиль';
      })
      .addCase(logoutUser.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось выйти из аккаунта';
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export const authReducer = authSlice.reducer;
