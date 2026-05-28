import {
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Form } from '@components/form/form';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { registerUser } from '@services/slices/auth-slice';

import styles from './register-page.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { error, isLoading } = useAppSelector((state) => state.auth);
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
    <main className={styles.authLayout}>
      <Form
        title="Регистрация"
        submitText="Зарегистрироваться"
        submittingText="Регистрируем..."
        isSubmitting={isLoading}
        error={error}
        onSubmit={(event) => void handleSubmit(event)}
        footer={
          <span className="pt-5">
            Уже зарегистрированы? <Link to="/login">Войти</Link>
          </span>
        }
      >
        <Input
          type="text"
          name="name"
          placeholder="Имя"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />

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
