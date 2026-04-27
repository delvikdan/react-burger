import { createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from '@services/slices/ingredients-slice';

import type { TIngredient } from '@utils/types';

type TConstructorState = {
  ingredients: TIngredient[];
};

const initialState: TConstructorState = {
  ingredients: [],
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIngredients.fulfilled, (state, action) => {
      state.ingredients = action.payload;
    });
  },
});

export const constructorReducer = constructorSlice.reducer;
