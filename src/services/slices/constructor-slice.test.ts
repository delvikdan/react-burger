import { describe, expect, it } from 'vitest';

import { ingredients } from '@utils/ingredients';

import {
  addIngredient,
  clearConstructor,
  constructorReducer,
  moveIngredient,
  removeIngredient,
} from './constructor-slice';

describe('Редьюсер конструктора', () => {
  const bun = ingredients.find((item) => item.type === 'bun')!;
  const main = ingredients.find((item) => item.type === 'main')!;
  const sauce = ingredients.find((item) => item.type === 'sauce')!;

  it('возвращает начальное состояние', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('добавляет булку в конструктор', () => {
    const state = constructorReducer(undefined, addIngredient(bun));

    expect(state.bun).toEqual(bun);
    expect(state.ingredients).toEqual([]);
  });

  it('добавляет ингредиент без типа булки в список ингредиентов', () => {
    const state = constructorReducer(undefined, addIngredient(main));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(main);
    expect(state.ingredients[0].key).toEqual(expect.any(String));
  });

  it('удаляет ингредиент из конструктора', () => {
    const ingredientToRemove = { ...main, key: 'main-1' };
    const ingredientToKeep = { ...sauce, key: 'sauce-1' };

    const state = constructorReducer(
      {
        bun: null,
        ingredients: [ingredientToRemove, ingredientToKeep],
      },
      removeIngredient('main-1')
    );

    expect(state.ingredients).toEqual([ingredientToKeep]);
  });

  it('перемещает ингредиент в конструкторе', () => {
    const first = { ...main, key: 'main-1' };
    const second = { ...sauce, key: 'sauce-1' };

    const state = constructorReducer(
      {
        bun: null,
        ingredients: [first, second],
      },
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.ingredients).toEqual([second, first]);
  });

  it('игнорирует перемещение с некорректными индексами', () => {
    const first = { ...main, key: 'main-1' };
    const second = { ...sauce, key: 'sauce-1' };
    const prevState = {
      bun,
      ingredients: [first, second],
    };

    const state = constructorReducer(
      prevState,
      moveIngredient({ fromIndex: -1, toIndex: 1 })
    );

    expect(state).toEqual(prevState);
  });

  it('очищает конструктор', () => {
    const state = constructorReducer(
      {
        bun,
        ingredients: [
          { ...main, key: 'main-1' },
          { ...sauce, key: 'sauce-1' },
        ],
      },
      clearConstructor()
    );

    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
