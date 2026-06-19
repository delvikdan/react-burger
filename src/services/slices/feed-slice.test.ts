import { describe, expect, it } from 'vitest';

import { mockFeedOrders } from '@utils/orders';

import {
  feedReducer,
  resetFeed,
  wsClose,
  wsConnecting,
  wsError,
  wsMessage,
  wsOpen,
} from './feed-slice';

describe('Редьюсер ленты заказов', () => {
  it('возвращает начальное состояние', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual({
      connectionStatus: 'offline',
      error: null,
      orders: [],
      total: 0,
      totalToday: 0,
    });
  });

  it('переводит соединение в состояние подключения', () => {
    const state = feedReducer(
      {
        connectionStatus: 'offline',
        error: 'Ошибка',
        orders: [],
        total: 0,
        totalToday: 0,
      },
      wsConnecting()
    );

    expect(state.connectionStatus).toBe('connecting');
    expect(state.error).toBeNull();
  });

  it('переводит соединение в состояние online при открытии', () => {
    const state = feedReducer(undefined, wsOpen());

    expect(state.connectionStatus).toBe('online');
    expect(state.error).toBeNull();
  });

  it('переводит соединение в состояние offline при закрытии', () => {
    const state = feedReducer(
      {
        connectionStatus: 'online',
        error: null,
        orders: mockFeedOrders,
        total: 10,
        totalToday: 3,
      },
      wsClose()
    );

    expect(state.connectionStatus).toBe('offline');
  });

  it('сохраняет ошибку сокета', () => {
    const state = feedReducer(undefined, wsError('Ошибка сокета'));

    expect(state.connectionStatus).toBe('offline');
    expect(state.error).toBe('Ошибка сокета');
  });

  it('сохраняет данные, полученные по сокету', () => {
    const state = feedReducer(
      undefined,
      wsMessage({
        success: true,
        orders: mockFeedOrders,
        total: 42,
        totalToday: 7,
      })
    );

    expect(state).toEqual({
      connectionStatus: 'online',
      error: null,
      orders: mockFeedOrders,
      total: 42,
      totalToday: 7,
    });
  });

  it('сбрасывает ленту к начальному состоянию', () => {
    const state = feedReducer(
      {
        connectionStatus: 'online',
        error: 'Ошибка',
        orders: mockFeedOrders,
        total: 42,
        totalToday: 7,
      },
      resetFeed()
    );

    expect(state).toEqual({
      connectionStatus: 'offline',
      error: null,
      orders: [],
      total: 0,
      totalToday: 0,
    });
  });
});
