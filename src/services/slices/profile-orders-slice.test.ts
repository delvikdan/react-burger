import { describe, expect, it } from 'vitest';

import { mockProfileOrders } from '@utils/orders';

import {
  profileOrdersReducer,
  resetProfileOrders,
  wsProfileOrdersClose,
  wsProfileOrdersConnecting,
  wsProfileOrdersError,
  wsProfileOrdersMessage,
  wsProfileOrdersOpen,
} from './profile-orders-slice';

describe('Редьюсер заказов профиля', () => {
  it('возвращает начальное состояние', () => {
    expect(profileOrdersReducer(undefined, { type: 'unknown' })).toEqual({
      connectionStatus: 'offline',
      error: null,
      orders: [],
    });
  });

  it('переводит соединение в состояние подключения', () => {
    const state = profileOrdersReducer(
      {
        connectionStatus: 'offline',
        error: 'Ошибка',
        orders: [],
      },
      wsProfileOrdersConnecting()
    );

    expect(state.connectionStatus).toBe('connecting');
    expect(state.error).toBeNull();
  });

  it('переводит соединение в состояние online при открытии', () => {
    const state = profileOrdersReducer(undefined, wsProfileOrdersOpen());

    expect(state.connectionStatus).toBe('online');
    expect(state.error).toBeNull();
  });

  it('переводит соединение в состояние offline при закрытии', () => {
    const state = profileOrdersReducer(
      {
        connectionStatus: 'online',
        error: null,
        orders: mockProfileOrders,
      },
      wsProfileOrdersClose()
    );

    expect(state.connectionStatus).toBe('offline');
  });

  it('сохраняет ошибку сокета', () => {
    const state = profileOrdersReducer(undefined, wsProfileOrdersError('Ошибка сокета'));

    expect(state.connectionStatus).toBe('offline');
    expect(state.error).toBe('Ошибка сокета');
  });

  it('сохраняет заказы, полученные по сокету', () => {
    const state = profileOrdersReducer(
      undefined,
      wsProfileOrdersMessage({
        success: true,
        orders: mockProfileOrders,
        total: 42,
        totalToday: 7,
      })
    );

    expect(state).toEqual({
      connectionStatus: 'online',
      error: null,
      orders: mockProfileOrders,
    });
  });

  it('сбрасывает заказы профиля к начальному состоянию', () => {
    const state = profileOrdersReducer(
      {
        connectionStatus: 'online',
        error: 'Ошибка',
        orders: mockProfileOrders,
      },
      resetProfileOrders()
    );

    expect(state).toEqual({
      connectionStatus: 'offline',
      error: null,
      orders: [],
    });
  });
});
