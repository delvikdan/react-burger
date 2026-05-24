import styles from './profile-order-page.module.css';

export const ProfileOrderPage = (): React.JSX.Element => (
  <div>
    <h1 className={`${styles.title} text text_type_main-large`}>История заказов</h1>
    <p
      className={`${styles.description} text text_type_main-default text_color_inactive`}
    >
      Страница находится в разработке.
    </p>
  </div>
);
