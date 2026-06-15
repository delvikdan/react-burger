import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';
import { Outlet, useMatch, useNavigate } from 'react-router-dom';

import { Modal } from '@components/modal/modal';
import { OrderList } from '@components/order-list/order-list';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  connectProfileOrders,
  disconnectProfileOrders,
  resetProfileOrders,
} from '@services/slices/profile-orders-slice';

import styles from './profile-order-page.module.css';

export const ProfileOrderPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const orderMatch = useMatch('/profile/orders/:id');
  const { connectionStatus, error, orders } = useAppSelector(
    (state) => state.profileOrders
  );
  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (leftOrder, rightOrder) =>
          new Date(rightOrder.updatedAt).getTime() -
          new Date(leftOrder.updatedAt).getTime()
      ),
    [orders]
  );

  useEffect(() => {
    dispatch(connectProfileOrders());

    return (): void => {
      dispatch(disconnectProfileOrders());
      dispatch(resetProfileOrders());
    };
  }, [dispatch]);

  return (
    <section className={styles.section}>
      {connectionStatus === 'connecting' && orders.length === 0 ? (
        <div className={styles.centered}>
          <Preloader />
        </div>
      ) : error && orders.length === 0 ? (
        <div className={styles.centered}>
          <p className="text text_type_main-medium">{error}</p>
        </div>
      ) : (
        <OrderList orders={sortedOrders} showStatus={true} />
      )}
      {orderMatch && (
        <Modal
          onClose={() => {
            void navigate('/profile/orders');
          }}
        >
          <Outlet />
        </Modal>
      )}
    </section>
  );
};
