import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@services/store';

const selectConstructorIngredients = (
  state: RootState
): RootState['burgerConstructor']['ingredients'] => state.burgerConstructor.ingredients;
const selectConstructorBun = (state: RootState): RootState['burgerConstructor']['bun'] =>
  state.burgerConstructor.bun;

export const selectIngredientCounters = createSelector(
  [selectConstructorIngredients, selectConstructorBun],
  (ingredients, bun) => {
    const counters = ingredients.reduce<Record<string, number>>((acc, ingredient) => {
      acc[ingredient._id] = (acc[ingredient._id] ?? 0) + 1;
      return acc;
    }, {});

    if (bun) {
      counters[bun._id] = 2;
    }

    return counters;
  }
);
