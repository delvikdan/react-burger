import { NavLink, Outlet } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { logoutUser } from '@services/slices/auth-slice';

import styles from './profile-page.module.css';

const getLinkClassName = ({ isActive }: { isActive: boolean }): string =>
  `${styles.profileLink} text text_type_main-medium pt-4 pb-4 ${isActive ? styles.profileLinkActive : ''}`;

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  return (
    <main className={`${styles.page} ${styles.profileLayout}`}>
      <nav className={styles.profileMenu}>
        <NavLink end to="/profile" className={getLinkClassName}>
          Профиль
        </NavLink>
        <NavLink to="/profile/orders" className={getLinkClassName}>
          История заказов
        </NavLink>
        <button
          type="button"
          disabled={isLoading}
          className={`${styles.logoutButton} text text_type_main-medium pt-4 pb-4`}
          onClick={() => {
            void dispatch(logoutUser());
          }}
        >
          Выйти
        </button>
        <p className={`${styles.profileDescription} text text_type_main-default mt-20`}>
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </nav>
      <section className={styles.profileContent}>
        <Outlet />
      </section>
    </main>
  );
};
