import { Button } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <main className={`${styles.page} ${styles.authLayout}`}>
      <h1 className={`${styles.title} text text_type_main-large`}>Сброс пароля</h1>

      <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
        <input
          className={styles.input}
          type="password"
          name="password"
          placeholder="Введите новый пароль"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          minLength={6}
          required
        />

        <input
          className={styles.input}
          type="text"
          name="token"
          placeholder="Введите код из письма"
          value={token}
          onChange={(event) => {
            setToken(event.target.value);
          }}
          required
        />

        <Button htmlType="submit" type="primary" size="large" disabled={isLoading}>
          {isLoading ? 'Сохраняем...' : 'Сохранить'}
        </Button>
      </form>

      {error && (
        <p
          className={`${styles.description} ${styles.errorText} text text_type_main-default mt-6`}
        >
          {error}
        </p>
      )}
    </main>
  );
};
