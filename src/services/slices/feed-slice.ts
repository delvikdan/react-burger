import { createAction, createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrdersFeedResponse } from '@utils/types';

type TFeedConnectionStatus = 'offline' | 'connecting' | 'online';

type TFeedState = {
  connectionStatus: TFeedConnectionStatus;
  error: string | null;
  orders: TOrdersFeedResponse['orders'];
  total: number;
  totalToday: number;
};

const initialState: TFeedState = {
  connectionStatus: 'offline',
  error: null,
  orders: [],
  total: 0,
  totalToday: 0,
};

export const connectFeed = createAction('feed/connect');
export const disconnectFeed = createAction('feed/disconnect');

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    wsConnecting: (state) => {
      state.connectionStatus = 'connecting';
      state.error = null;
    },
    wsOpen: (state) => {
      state.connectionStatus = 'online';
      state.error = null;
    },
    wsClose: (state) => {
      state.connectionStatus = 'offline';
    },
    wsError: (state, action: PayloadAction<string>) => {
      state.connectionStatus = 'offline';
      state.error = action.payload;
    },
    wsMessage: (state, action: PayloadAction<TOrdersFeedResponse>) => {
      state.connectionStatus = 'online';
      state.error = null;
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    resetFeed: () => initialState,
  },
});

export const { resetFeed, wsClose, wsConnecting, wsError, wsMessage, wsOpen } =
  feedSlice.actions;
export const feedReducer = feedSlice.reducer;
