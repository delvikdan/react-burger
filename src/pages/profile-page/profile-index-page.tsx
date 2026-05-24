import { Button } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { updateUser } from '@services/slices/auth-slice';

import styles from './profile-index-page.module.css';

export const ProfileIndexPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { error, isLoading, user } = useAppSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(user.name);
    setEmail(user.email);
    setPassword('');
  }, [user]);

  const isChanged = useMemo(() => {
    if (!user) {
      return false;
    }

    return name !== user.name || email !== user.email || password !== '';
  }, [email, name, password, user]);

  const handleCancel = (): void => {
    if (!user) {
      return;
    }

    setName(user.name);
    setEmail(user.email);
    setPassword('');
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    await dispatch(
      updateUser({
        name,
        email,
        password,
      })
    );

    setPassword('');
  };

  return (
    <div>
      <h1 className={`${styles.title} text text_type_main-large`}>Профиль</h1>

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
          placeholder="Новый пароль"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />

        {isChanged && (
          <div className={styles.profileActions}>
            <Button htmlType="submit" type="primary" size="medium" disabled={isLoading}>
              Сохранить
            </Button>
            <Button
              htmlType="button"
              type="secondary"
              size="medium"
              disabled={isLoading}
              onClick={handleCancel}
            >
              Отмена
            </Button>
          </div>
        )}
      </form>

      {error && (
        <p
          className={`${styles.description} ${styles.errorText} text text_type_main-default mt-6`}
        >
          {error}
        </p>
      )}
    </div>
  );
};
