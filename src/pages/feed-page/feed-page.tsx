import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';

import { Modal } from '@components/modal/modal';
import { OrderList } from '@components/order-list/order-list';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { connectFeed, disconnectFeed, resetFeed } from '@services/slices/feed-slice';

import type { TOrder } from '@utils/types';

import styles from './feed-page.module.css';

const ORDERS_PER_COLUMN = 10;
const MAX_COLUMNS = 2;
const MAX_VISIBLE_ORDERS = ORDERS_PER_COLUMN * MAX_COLUMNS;

const getOrderColumns = (orders: TOrder[]): TOrder[][] => {
  const limitedOrders = orders.slice(0, MAX_VISIBLE_ORDERS);

  return Array.from(
    { length: Math.ceil(limitedOrders.length / ORDERS_PER_COLUMN) },
    (_, index) =>
      limitedOrders.slice(index * ORDERS_PER_COLUMN, (index + 1) * ORDERS_PER_COLUMN)
  );
};

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const orderMatch = useMatch('/feed/:id');
  const { connectionStatus, error, orders, total, totalToday } = useAppSelector(
    (state) => state.feed
  );

  useEffect(() => {
    dispatch(connectFeed());

    return (): void => {
      dispatch(disconnectFeed());
      dispatch(resetFeed());
    };
  }, [dispatch]);

  const doneColumns = useMemo(
    () => getOrderColumns(orders.filter((order) => order.status === 'done')),
    [orders]
  );
  const pendingColumns = useMemo(
    () => getOrderColumns(orders.filter((order) => order.status === 'pending')),
    [orders]
  );

  return (
    <main className={styles.page}>
      <h1 className={`${styles.title} text text_type_main-large`}>Лента заказов</h1>
      <div className={styles.layout}>
        <section className={styles.ordersSection}>
          {connectionStatus === 'connecting' && orders.length === 0 ? (
            <div className={styles.centered}>
              <Preloader />
            </div>
          ) : error && orders.length === 0 ? (
            <div className={styles.centered}>
              <p className="text text_type_main-medium">{error}</p>
            </div>
          ) : (
            <OrderList orders={orders} />
          )}
        </section>
        <aside className={styles.summary}>
          <div className={styles.statusColumns}>
            <section className={styles.statusBlock}>
              <h2 className="text text_type_main-medium mb-6">Готовы:</h2>
              <div className={styles.columnGrid}>
                {doneColumns.map((column, index) => (
                  <ul key={`done-${index}`} className={styles.numberList}>
                    {column.map((order) => (
                      <li
                        key={order._id}
                        className={`${styles.doneNumber} text text_type_digits-default`}
                      >
                        {order.number}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </section>
            <section className={styles.statusBlock}>
              <h2 className="text text_type_main-medium mb-6">В работе:</h2>
              <div className={styles.columnGrid}>
                {pendingColumns.map((column, index) => (
                  <ul key={`pending-${index}`} className={styles.numberList}>
                    {column.map((order) => (
                      <li key={order._id} className="text text_type_digits-default">
                        {order.number}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </section>
          </div>
          <section className={styles.totalBlock}>
            <h2 className="text text_type_main-medium">Выполнено за все время:</h2>
            <p className={`${styles.totalNumber} text text_type_digits-large`}>
              {total.toLocaleString('ru-RU')}
            </p>
          </section>
          <section className={styles.totalBlock}>
            <h2 className="text text_type_main-medium">Выполнено за сегодня:</h2>
            <p className={`${styles.totalNumber} text text_type_digits-large`}>
              {totalToday.toLocaleString('ru-RU')}
            </p>
          </section>
        </aside>
      </div>

      {orderMatch && (
        <Modal
          onClose={() => {
            void navigate('/feed');
          }}
        >
          <Outlet />
        </Modal>
      )}
    </main>
  );
};
