import styles from './feed-page.module.css';

export const FeedPage = (): React.JSX.Element => (
  <main className={styles.page}>
    <h1 className={`${styles.title} text text_type_main-large`}>Лента заказов</h1>
    <p
      className={`${styles.description} text text_type_main-default text_color_inactive`}
    >
      Страница находится в разработке.
    </p>
  </main>
);
