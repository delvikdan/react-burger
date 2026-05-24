import { Button } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { registerUser } from '@services/slices/auth-slice';

import styles from './register-page.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { error, isLoading, user } = useAppSelector((state) => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    await dispatch(
      registerUser({
        email,
        password,
        name,
      })
    );
  };

  return (
    <main className={`${styles.page} ${styles.authLayout}`}>
      <h1 className={`${styles.title} text text_type_main-large`}>Регистрация</h1>

      <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
        <input
          className={styles.input}
          type="text"
          name="name"
          placeholder="Имя"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          required
        />

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
          {isLoading ? 'Регистрируем...' : 'Зарегистрироваться'}
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
          Пользователь {user.email} успешно зарегистрирован.
        </p>
      )}
      <p className="pt-5">
        Уже зарегистрированы?{' '}
        <Link to="/login" className={styles.link}>
          Войти
        </Link>
      </p>
    </main>
  );
};
