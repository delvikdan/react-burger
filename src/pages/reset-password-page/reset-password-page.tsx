import { Input, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Form } from '@components/form/form';
import { resetPasswordApi } from '@services/burger-api';

import styles from './reset-password-page.module.css';

const RESET_FLAG_KEY = 'isPasswordResetRequested';

export const ResetPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canReset = localStorage.getItem(RESET_FLAG_KEY) === 'true';

    if (!canReset) {
      void navigate('/forgot-password');
    }
  }, [navigate]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await resetPasswordApi({ password, token });
      localStorage.removeItem(RESET_FLAG_KEY);
      void navigate('/login');
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не удалось сбросить пароль'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.authLayout}>
      <Form
        title="Восстановление пароля"
        submitText="Сохранить"
        submittingText="Сохраняем..."
        isSubmitting={isLoading}
        error={error}
        onSubmit={(event) => void handleSubmit(event)}
        footer={
          <span>
            Вспомнили пароль? <Link to="/login">Войти</Link>
          </span>
        }
      >
        <PasswordInput
          icon="ShowIcon"
          name="password"
          placeholder="Введите новый пароль"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          value={password}
        />

        <Input
          type="text"
          name="token"
          placeholder="Введите код из письма"
          value={token}
          onChange={(event) => {
            setToken(event.target.value);
          }}
        />
      </Form>
    </main>
  );
};
