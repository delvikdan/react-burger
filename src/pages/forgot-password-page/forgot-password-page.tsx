import { Button } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { requestPasswordResetApi } from '@services/burger-api';

import styles from './forgot-password-page.module.css';

const RESET_FLAG_KEY = 'isPasswordResetRequested';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await requestPasswordResetApi({ email });
      localStorage.setItem(RESET_FLAG_KEY, 'true');
      void navigate('/reset-password');
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не удалось отправить письмо для восстановления'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={`${styles.page} ${styles.authLayout}`}>
      <h1 className={`${styles.title} text text_type_main-large`}>
        Восстановление пароля
      </h1>

      <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="Укажите e-mail"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          required
        />

        <Button htmlType="submit" type="primary" size="large" disabled={isLoading}>
          {isLoading ? 'Отправляем...' : 'Восстановить'}
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
