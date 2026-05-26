import { EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Form } from '@components/form/form';
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
    <main className={styles.authLayout}>
      <Form
        title="Восстановление пароля"
        submitText="Восстановить"
        submittingText="Отправляем..."
        isSubmitting={isLoading}
        error={error}
        onSubmit={(event) => void handleSubmit(event)}
        footer={
          <span>
            Вспомнили пароль? <Link to="/login">Войти</Link>
          </span>
        }
      >
        <EmailInput
          name="email"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          value={email}
        />
      </Form>
    </main>
  );
};
