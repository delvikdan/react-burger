import { describe, expect, it } from 'vitest';

import { ingredients } from '@utils/ingredients';

import {
  clearCurrentIngredient,
  ingredientDetailsReducer,
  setCurrentIngredient,
} from './ingredient-details-slice';

describe('Редьюсер деталей ингредиента', () => {
  const ingredient = ingredients[0];

  it('возвращает начальное состояние', () => {
    expect(ingredientDetailsReducer(undefined, { type: 'unknown' })).toEqual({
      ingredient: null,
    });
  });

  it('устанавливает текущий ингредиент', () => {
    const state = ingredientDetailsReducer(undefined, setCurrentIngredient(ingredient));

    expect(state.ingredient).toEqual(ingredient);
  });

  it('сбрасывает текущий ингредиент', () => {
    const state = ingredientDetailsReducer({ ingredient }, clearCurrentIngredient());

    expect(state.ingredient).toBeNull();
  });
});
