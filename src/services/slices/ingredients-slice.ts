import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchIngredientsApi } from '@services/burger-api';

import type { TIngredient } from '@utils/types';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_arg, { rejectWithValue }) => {
  try {
    return await fetchIngredientsApi();
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Не удалось загрузить ингредиенты';

    return rejectWithValue(message);
  }
});

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить ингредиенты';
      });
  },
});

export const ingredientsReducer = ingredientsSlice.reducer;
