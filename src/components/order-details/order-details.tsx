import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

type TOrderDetailsProps = {
  orderNumber: number;
};

export const OrderDetails = ({ orderNumber }: TOrderDetailsProps): React.JSX.Element => (
  <article className={styles.order_details}>
    <p className="text text_type_digits-large mb-8">{orderNumber}</p>
    <p className="text text_type_main-medium mb-15">идентификатор заказа</p>
    <div className={`${styles.icon} mb-15`}>
      <CheckMarkIcon type="primary" />
    </div>
    <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
    <p className="text text_type_main-default text_color_inactive">
      Дождитесь готовности на орбитальной станции
    </p>
  </article>
);
