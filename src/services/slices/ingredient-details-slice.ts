import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient } from '@utils/types';

type TIngredientDetailsState = {
  ingredient: TIngredient | null;
};

const initialState: TIngredientDetailsState = {
  ingredient: null,
};

export const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    clearCurrentIngredient: (state) => {
      state.ingredient = null;
    },
    setCurrentIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredient = action.payload;
    },
  },
});

export const { clearCurrentIngredient, setCurrentIngredient } =
  ingredientDetailsSlice.actions;
export const ingredientDetailsReducer = ingredientDetailsSlice.reducer;
