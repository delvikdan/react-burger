import { Button } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { loginUser } from '@services/slices/auth-slice';

import styles from './login-page.module.css';

export const LoginPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { error, isLoading, user } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    await dispatch(
      loginUser({
        email,
        password,
      })
    );
  };

  return (
    <main className={`${styles.page} ${styles.authLayout}`}>
      <h1 className={`${styles.title} text text_type_main-large`}>Вход</h1>

      <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="E-mail"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          required
        />

        <input
          className={styles.input}
          type="password"
          name="password"
          placeholder="Пароль"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          minLength={6}
          required
        />

        <Button htmlType="submit" type="primary" size="large" disabled={isLoading}>
          {isLoading ? 'Входим...' : 'Войти'}
        </Button>
      </form>

      {error && (
        <p
          className={`${styles.description} ${styles.errorText} text text_type_main-default mt-6`}
        >
          {error}
        </p>
      )}

      {user && !error && (
        <p
          className={`${styles.description} ${styles.successText} text text_type_main-default mt-6`}
        >
          Пользователь {user.email} успешно авторизован.
        </p>
      )}

      <p className="pt-5">
        Вы — новый пользователь?{' '}
        <Link to="/register" className={styles.link}>
          Зарегистрироваться
        </Link>
      </p>
      <p>
        Забыли пароль?{' '}
        <Link to="/forgot-password" className={styles.link}>
          Восстановить пароль
        </Link>
      </p>
    </main>
  );
};
