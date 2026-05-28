import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { updateUser } from '@services/slices/auth-slice';

import styles from './profile-index-page.module.css';

const PASSWORD_MASK = '******';

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
    setPassword(PASSWORD_MASK);
  }, [user]);

  const isChanged = useMemo(() => {
    if (!user) {
      return false;
    }

    return (
      name !== user.name ||
      email !== user.email ||
      (password !== '' && password !== PASSWORD_MASK)
    );
  }, [email, name, password, user]);

  const handleCancel = (): void => {
    if (!user) {
      return;
    }

    setName(user.name);
    setEmail(user.email);
    setPassword(PASSWORD_MASK);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    await dispatch(
      updateUser({
        name,
        email,
        password: password === PASSWORD_MASK ? undefined : password,
      })
    );

    setPassword(PASSWORD_MASK);
  };

  return (
    <div>
      <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
        <Input
          name="name"
          placeholder="Имя"
          size="default"
          onChange={(event) => {
            setName(event.target.value);
          }}
          type="text"
          value={name}
          icon="EditIcon"
        />

        <EmailInput
          isIcon
          name="email"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          placeholder="Логин"
          value={email}
        />

        <PasswordInput
          icon="EditIcon"
          name="password"
          size="default"
          onFocus={() => {
            if (password === PASSWORD_MASK) {
              setPassword('');
            }
          }}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          value={password}
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
