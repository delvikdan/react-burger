import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import styles from './modal.module.css';

const modalsRoot = document.getElementById('modals')!;

type TModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export const Modal = ({ title, children, onClose }: TModalProps): React.JSX.Element => {
  useEffect(() => {
    const listener = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', listener);

    return (): void => {
      document.removeEventListener('keydown', listener);
    };
  }, [onClose]);

  return createPortal(
    <>
      <ModalOverlay onClose={onClose} />
      <section
        aria-labelledby="modal-title"
        aria-modal={true}
        className={styles.modal}
        onClick={(event) => {
          event.stopPropagation();
        }}
        role="dialog"
      >
        <header className={`${styles.header} p-10 pb-0`}>
          <h2 id="modal-title" className="text text_type_main-large">
            {title}
          </h2>
          <button
            aria-label="Close modal window"
            className={styles.close_button}
            onClick={onClose}
            type="button"
          >
            <CloseIcon type="primary" />
          </button>
        </header>
        <div className={`${styles.content} p-10`}>{children}</div>
      </section>
    </>,
    modalsRoot
  );
};
