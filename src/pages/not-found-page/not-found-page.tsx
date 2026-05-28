import { Link } from 'react-router-dom';

import styles from './not-found-page.module.css';

export const NotFoundPage = (): React.JSX.Element => (
  <main className={styles.page}>
    <h1 className={`${styles.title} text text_type_main-large`}>404</h1>
    <p className={`${styles.description} text text_type_main-default mb-6`}>
      Такой страницы не существует.
    </p>
    <Link className="text text_type_main-default" to="/">
      Перейти на главную
    </Link>
  </main>
);
