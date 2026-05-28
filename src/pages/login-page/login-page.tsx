import { EmailInput, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Form } from '@components/form/form';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { loginUser } from '@services/slices/auth-slice';

import styles from './login-page.module.css';

export const LoginPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { error, isLoading } = useAppSelector((state) => state.auth);
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
    <main className={styles.authLayout}>
      <Form
        title="Вход"
        submitText="Войти"
        submittingText="Входим..."
        isSubmitting={isLoading}
        error={error}
        onSubmit={(event) => void handleSubmit(event)}
        footer={
          <>
            <span>
              Вы — новый пользователь? <Link to="/register">Зарегистрироваться</Link>
            </span>
            <span>
              Забыли пароль? <Link to="/forgot-password">Восстановить пароль</Link>
            </span>
          </>
        }
      >
        <EmailInput
          name="email"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          value={email}
        />

        <PasswordInput
          icon="ShowIcon"
          name="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          value={password}
        />
      </Form>
    </main>
  );
};
