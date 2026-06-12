import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '@services/slices/auth-slice';
import { constructorReducer } from '@services/slices/constructor-slice';
import {
  connectFeed,
  disconnectFeed,
  feedReducer,
  wsClose,
  wsConnecting,
  wsError,
  wsMessage,
  wsOpen,
} from '@services/slices/feed-slice';
import { ingredientDetailsReducer } from '@services/slices/ingredient-details-slice';
import { ingredientsReducer } from '@services/slices/ingredients-slice';
import { orderReducer } from '@services/slices/order-slice';
import {
  connectProfileOrders,
  disconnectProfileOrders,
  profileOrdersReducer,
  wsProfileOrdersClose,
  wsProfileOrdersConnecting,
  wsProfileOrdersError,
  wsProfileOrdersMessage,
  wsProfileOrdersOpen,
} from '@services/slices/profile-orders-slice';
import {
  createSocketMiddleware,
  getProfileOrdersSocketUrl,
  getPublicFeedSocketUrl,
  parseProfileOrdersFeedMessage,
  parsePublicOrdersFeedMessage,
} from '@services/socket-middleware';

const publicFeedMiddleware = createSocketMiddleware({
  close: wsClose,
  connect: connectFeed,
  connecting: wsConnecting,
  disconnect: disconnectFeed,
  error: wsError,
  getSocketUrl: getPublicFeedSocketUrl,
  message: wsMessage,
  open: wsOpen,
  parseMessage: (payload) => parsePublicOrdersFeedMessage(payload),
});

const profileOrdersMiddleware = createSocketMiddleware({
  close: wsProfileOrdersClose,
  connect: connectProfileOrders,
  connecting: wsProfileOrdersConnecting,
  disconnect: disconnectProfileOrders,
  error: wsProfileOrdersError,
  getSocketUrl: getProfileOrdersSocketUrl,
  message: wsProfileOrdersMessage,
  open: wsProfileOrdersOpen,
  parseMessage: (payload) => parseProfileOrdersFeedMessage(payload),
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    burgerConstructor: constructorReducer,
    feed: feedReducer,
    ingredientDetails: ingredientDetailsReducer,
    ingredients: ingredientsReducer,
    order: orderReducer,
    profileOrders: profileOrdersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(publicFeedMiddleware, profileOrdersMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
