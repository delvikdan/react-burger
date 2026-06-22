import { describe, expect, it } from 'vitest';

import { clearOrder, createOrder, orderReducer } from './order-slice';

describe('Редьюсер заказа', () => {
  it('возвращает начальное состояние', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual({
      error: null,
      isLoading: false,
      orderNumber: null,
    });
  });

  it('очищает данные заказа', () => {
    const state = orderReducer(
      {
        error: 'Ошибка',
        isLoading: false,
        orderNumber: 12345,
      },
      clearOrder()
    );

    expect(state).toEqual({
      error: null,
      isLoading: false,
      orderNumber: null,
    });
  });

  it('включает загрузку при начале создания заказа', () => {
    const state = orderReducer(
      {
        error: 'Ошибка',
        isLoading: false,
        orderNumber: null,
      },
      createOrder.pending('request-id', ['1', '2'])
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('сохраняет номер заказа после успешного создания', () => {
    const state = orderReducer(
      {
        error: null,
        isLoading: true,
        orderNumber: null,
      },
      createOrder.fulfilled(12345, 'request-id', ['1', '2'])
    );

    expect(state.isLoading).toBe(false);
    expect(state.orderNumber).toBe(12345);
  });

  it('сохраняет ошибку после неудачного создания заказа', () => {
    const state = orderReducer(
      {
        error: null,
        isLoading: true,
        orderNumber: null,
      },
      createOrder.rejected(
        new Error('fail'),
        'request-id',
        ['1', '2'],
        'Не удалось оформить заказ'
      )
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось оформить заказ');
  });
});
