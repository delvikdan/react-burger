import { Button } from '@krgaa/react-developer-burger-ui-components';

import type { FormEvent, ReactNode } from 'react';

import styles from './form.module.css';

type FormProps = {
  title: string;
  submitText: string;
  isSubmitting?: boolean;
  submittingText?: string;
  error?: string | null;
  footer?: ReactNode;
  children: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export const Form = ({
  title,
  submitText,
  isSubmitting = false,
  submittingText,
  error,
  footer,
  children,
  onSubmit,
}: FormProps): React.JSX.Element => (
  <>
    <h1 className="text text_type_main-medium mb-6">{title}</h1>

    <form className={styles.form} onSubmit={onSubmit}>
      {children}

      <Button htmlType="submit" type="primary" size="large" disabled={isSubmitting}>
        {isSubmitting ? (submittingText ?? submitText) : submitText}
      </Button>
    </form>

    {error && (
      <p className={`${styles.errorText} text text_type_main-default mt-6`}>{error}</p>
    )}

    {footer && (
      <div
        className={`${styles.footer} text text_type_main-default text_color_inactive mt-20`}
      >
        {footer}
      </div>
    )}
  </>
);
