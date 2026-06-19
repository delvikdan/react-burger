import { describe, expect, it } from 'vitest';

import { ingredients } from '@utils/ingredients';

import { fetchIngredients, ingredientsReducer } from './ingredients-slice';

describe('Редьюсер ингредиентов', () => {
  it('возвращает начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual({
      error: null,
      ingredients: [],
      isLoading: false,
    });
  });

  it('устанавливает флаг загрузки при начале запроса ингредиентов', () => {
    const state = ingredientsReducer(
      {
        error: 'Ошибка',
        ingredients: [],
        isLoading: false,
      },
      fetchIngredients.pending('request-id', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('сохраняет ингредиенты после успешного запроса', () => {
    const state = ingredientsReducer(
      {
        error: null,
        ingredients: [],
        isLoading: true,
      },
      fetchIngredients.fulfilled(ingredients, 'request-id', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(ingredients);
  });

  it('сохраняет ошибку после неудачного запроса ингредиентов', () => {
    const state = ingredientsReducer(
      {
        error: null,
        ingredients: [],
        isLoading: true,
      },
      fetchIngredients.rejected(
        new Error('fail'),
        'request-id',
        undefined,
        'Не удалось загрузить ингредиенты'
      )
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось загрузить ингредиенты');
  });
});
