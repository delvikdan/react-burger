import { refreshTokenApi } from '@services/burger-api';
import { BURGER_WS_URL } from '@utils/constants';

import type {
  ActionCreatorWithPayload,
  ActionCreatorWithoutPayload,
  Middleware,
  MiddlewareAPI,
  UnknownAction,
} from '@reduxjs/toolkit';
import type { TOrdersFeedResponse } from '@utils/types';

type TSocketParseResult<TMessage> =
  | {
      payload: TMessage;
      type: 'message';
    }
  | {
      payload: string;
      type: 'error';
    }
  | {
      type: 'reconnect';
    };

type TSocketMiddlewareConfig<TMessage> = {
  close: ActionCreatorWithoutPayload<string>;
  connect: ActionCreatorWithoutPayload<string>;
  connecting: ActionCreatorWithoutPayload<string>;
  disconnect: ActionCreatorWithoutPayload<string>;
  error: ActionCreatorWithPayload<string, string>;
  getSocketUrl: (api: MiddlewareAPI) => Promise<string> | string;
  message: ActionCreatorWithPayload<TMessage, string>;
  open: ActionCreatorWithoutPayload<string>;
  parseMessage: (
    data: unknown,
    api: MiddlewareAPI
  ) => Promise<TSocketParseResult<TMessage>> | TSocketParseResult<TMessage>;
};

type TAuthStateForSocket = {
  auth: {
    accessToken: string | null;
  };
};

const INVALID_TOKEN_MESSAGE = 'Invalid or missing token';

const isOrdersFeedResponse = (payload: unknown): payload is TOrdersFeedResponse =>
  typeof payload === 'object' &&
  payload !== null &&
  'success' in payload &&
  payload.success === true &&
  'orders' in payload &&
  Array.isArray(payload.orders) &&
  'total' in payload &&
  typeof payload.total === 'number' &&
  'totalToday' in payload &&
  typeof payload.totalToday === 'number';

const isInvalidTokenPayload = (payload: unknown): payload is { message: string } =>
  typeof payload === 'object' &&
  payload !== null &&
  'message' in payload &&
  payload.message === INVALID_TOKEN_MESSAGE;

export const createSocketMiddleware = <TMessage>({
  close,
  connect,
  connecting,
  disconnect,
  error,
  getSocketUrl,
  message,
  open,
  parseMessage,
}: TSocketMiddlewareConfig<TMessage>): Middleware => {
  let socket: WebSocket | null = null;
  let reconnectRequested = false;

  const closeCurrentSocket = (): void => {
    if (!socket) {
      return;
    }

    socket.onopen = null;
    socket.onclose = null;
    socket.onerror = null;
    socket.onmessage = null;
    socket.close();
    socket = null;
  };

  return (api) => (next) => (action: unknown) => {
    if (!action || typeof action !== 'object' || !('type' in action)) {
      return next(action as UnknownAction);
    }

    const typedAction = action as UnknownAction;

    if (connect.match(typedAction)) {
      reconnectRequested = false;
      closeCurrentSocket();
      api.dispatch(connecting());

      void Promise.resolve(getSocketUrl(api))
        .then((url) => {
          socket = new WebSocket(url);

          socket.onopen = (): void => {
            api.dispatch(open());
          };

          socket.onerror = (): void => {
            api.dispatch(error('Не удалось установить сокет-соединение'));
          };

          socket.onmessage = (event): void => {
            if (typeof event.data !== 'string') {
              api.dispatch(error('Сервер вернул некорректные данные'));

              return;
            }

            const rawPayload: unknown = JSON.parse(event.data);

            void Promise.resolve(parseMessage(rawPayload, api))
              .then((result) => {
                if (result.type === 'message') {
                  api.dispatch(message(result.payload));

                  return;
                }

                if (result.type === 'error') {
                  api.dispatch(error(result.payload));

                  return;
                }

                reconnectRequested = true;
                closeCurrentSocket();
                api.dispatch(connect());
              })
              .catch(() => {
                api.dispatch(error('Не удалось обработать данные сокет-соединения'));
              });
          };

          socket.onclose = (): void => {
            api.dispatch(close());
            socket = null;

            if (reconnectRequested) {
              reconnectRequested = false;
            }
          };
        })
        .catch((connectionError: unknown) => {
          api.dispatch(
            error(
              connectionError instanceof Error
                ? connectionError.message
                : 'Не удалось подготовить сокет-соединение'
            )
          );
        });
    }

    if (disconnect.match(typedAction)) {
      reconnectRequested = false;
      closeCurrentSocket();
      api.dispatch(close());
    }

    return next(typedAction);
  };
};

export const parsePublicOrdersFeedMessage = (
  payload: unknown
): TSocketParseResult<TOrdersFeedResponse> =>
  isOrdersFeedResponse(payload)
    ? { type: 'message', payload }
    : { type: 'error', payload: 'Сервер вернул некорректные данные ленты заказов' };

export const parseProfileOrdersFeedMessage = async (
  payload: unknown
): Promise<TSocketParseResult<TOrdersFeedResponse>> => {
  if (isInvalidTokenPayload(payload)) {
    try {
      await refreshTokenApi();

      return { type: 'reconnect' };
    } catch {
      return { type: 'error', payload: 'Сессия истекла, войдите заново' };
    }
  }

  return isOrdersFeedResponse(payload)
    ? { type: 'message', payload }
    : { type: 'error', payload: 'Сервер вернул некорректные данные заказов' };
};

export const getPublicFeedSocketUrl = (): string => `${BURGER_WS_URL}/all`;

export const getProfileOrdersSocketUrl = (api: MiddlewareAPI): string => {
  const state = api.getState() as TAuthStateForSocket;
  const socketToken = state.auth.accessToken?.replace('Bearer ', '');

  if (!socketToken) {
    throw new Error('Требуется авторизация');
  }

  return `${BURGER_WS_URL}?token=${socketToken}`;
};
