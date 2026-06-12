import { OrderCard } from '@components/order-card/order-card';

import type { TOrder } from '@utils/types';

import styles from './order-list.module.css';

type TOrderListProps = {
  orders: TOrder[];
  showStatus?: boolean;
};

export const OrderList = ({
  orders,
  showStatus = false,
}: TOrderListProps): React.JSX.Element => (
  <ul className={styles.list}>
    {orders.map((order) => (
      <li key={order._id}>
        <OrderCard order={order} showStatus={showStatus} to={order.number.toString()} />
      </li>
    ))}
  </ul>
);
