import { createAction, createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrdersFeedResponse } from '@utils/types';

type TProfileOrdersConnectionStatus = 'offline' | 'connecting' | 'online';

type TProfileOrdersState = {
  connectionStatus: TProfileOrdersConnectionStatus;
  error: string | null;
  orders: TOrdersFeedResponse['orders'];
};

const initialState: TProfileOrdersState = {
  connectionStatus: 'offline',
  error: null,
  orders: [],
};

export const connectProfileOrders = createAction('profileOrders/connect');
export const disconnectProfileOrders = createAction('profileOrders/disconnect');

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
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
    },
    resetProfileOrders: () => initialState,
  },
});

export const {
  resetProfileOrders,
  wsClose: wsProfileOrdersClose,
  wsConnecting: wsProfileOrdersConnecting,
  wsError: wsProfileOrdersError,
  wsMessage: wsProfileOrdersMessage,
  wsOpen: wsProfileOrdersOpen,
} = profileOrdersSlice.actions;
export const profileOrdersReducer = profileOrdersSlice.reducer;
