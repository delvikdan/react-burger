import type { TOrder, TOrderStatus } from '@utils/types';

const now = new Date('2026-06-12T19:30:00.000Z');

const createIsoDate = (hoursAgo: number): string =>
  new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString();

export const mockFeedOrders: TOrder[] = [
  {
    _id: 'feed-1',
    number: 93001,
    name: 'Флюоресцентный бургер',
    status: 'done',
    ingredients: [
      '60666c42cc7b410027a1a9b2',
      '60666c42cc7b410027a1a9b3',
      '60666c42cc7b410027a1a9b7',
      '60666c42cc7b410027a1a9bf',
      '60666c42cc7b410027a1a9b2',
    ],
    createdAt: createIsoDate(1),
    updatedAt: createIsoDate(1),
  },
  {
    _id: 'feed-2',
    number: 93002,
    name: 'Краторный spicy burger',
    status: 'pending',
    ingredients: [
      '60666c42cc7b410027a1a9b1',
      '60666c42cc7b410027a1a9b5',
      '60666c42cc7b410027a1a9ba',
      '60666c42cc7b410027a1a9bc',
      '60666c42cc7b410027a1a9b1',
    ],
    createdAt: createIsoDate(2),
    updatedAt: createIsoDate(2),
  },
  {
    _id: 'feed-3',
    number: 93003,
    name: 'Space фреш',
    status: 'created',
    ingredients: [
      '60666c42cc7b410027a1a9b2',
      '60666c42cc7b410027a1a9be',
      '60666c42cc7b410027a1a9b8',
      '60666c42cc7b410027a1a9bd',
      '60666c42cc7b410027a1a9b2',
    ],
    createdAt: createIsoDate(4),
    updatedAt: createIsoDate(4),
  },
  {
    _id: 'feed-4',
    number: 93004,
    name: 'Минеральный double burger',
    status: 'done',
    ingredients: [
      '60666c42cc7b410027a1a9b1',
      '60666c42cc7b410027a1a9bb',
      '60666c42cc7b410027a1a9b4',
      '60666c42cc7b410027a1a9b9',
      '60666c42cc7b410027a1a9b1',
    ],
    createdAt: createIsoDate(6),
    updatedAt: createIsoDate(6),
  },
  {
    _id: 'feed-5',
    number: 93005,
    name: 'Альфа-сахаридный бургер',
    status: 'pending',
    ingredients: [
      '60666c42cc7b410027a1a9b2',
      '60666c42cc7b410027a1a9bd',
      '60666c42cc7b410027a1a9b6',
      '60666c42cc7b410027a1a9ba',
      '60666c42cc7b410027a1a9bf',
      '60666c42cc7b410027a1a9b2',
    ],
    createdAt: createIsoDate(8),
    updatedAt: createIsoDate(8),
  },
  {
    _id: 'feed-6',
    number: 93006,
    name: 'Galactic special',
    status: 'done',
    ingredients: [
      '60666c42cc7b410027a1a9b1',
      '60666c42cc7b410027a1a9b4',
      '60666c42cc7b410027a1a9bc',
      '60666c42cc7b410027a1a9b8',
      '60666c42cc7b410027a1a9bb',
      '60666c42cc7b410027a1a9b1',
    ],
    createdAt: createIsoDate(12),
    updatedAt: createIsoDate(12),
  },
];

export const mockProfileOrders: TOrder[] = [
  mockFeedOrders[1],
  mockFeedOrders[2],
  mockFeedOrders[4],
];

export const getOrderStatusText = (status: TOrderStatus): string => {
  const statusMap: Record<TOrderStatus, string> = {
    created: 'Создан',
    pending: 'Готовится',
    done: 'Выполнен',
  };

  return statusMap[status];
};
