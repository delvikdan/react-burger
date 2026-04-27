import { createSlice, nanoid } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils/types';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: (TIngredient & { key: string })[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, action: { payload: TIngredient }) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
        return;
      }

      state.ingredients.push({ ...action.payload, key: nanoid() });
    },
    removeIngredient: (state, action: { payload: string }) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.key !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: { payload: { fromIndex: number; toIndex: number } }
    ) => {
      const { fromIndex, toIndex } = action.payload;

      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.ingredients.length ||
        toIndex >= state.ingredients.length ||
        fromIndex === toIndex
      ) {
        return;
      }

      const [movedIngredient] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedIngredient);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
  },
});

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } =
  constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;
