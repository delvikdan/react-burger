import styles from './modal-overlay.module.css';

type TModalOverlayProps = {
  onClose: () => void;
};

export const ModalOverlay = ({ onClose }: TModalOverlayProps): React.JSX.Element => (
  <button
    aria-label="Close modal window"
    className={styles.overlay}
    onClick={onClose}
    type="button"
  />
);
