import { Button, Modal } from '@cross/ui';
import { FC } from 'react';
import styles from './SuccessModal.module.less';

interface SuccessModalProps {
  open: boolean;
  onOk: () => void;
}

const SuccessModal: FC<SuccessModalProps> = ({ open, onOk }) => {
  return (
    <Modal centered width={325} visible={open} closable={false}>
      <div className={styles.root}>
        <p className="success medium">Successful!</p>
        <p>Withdraw successfully!</p>

        <div className={styles.circle}>
          <img src="/images/buy/check-mark.svg" alt="checkmark" />
        </div>

        <Button onClick={onOk} className={styles.btnSubmit} type="secondary">
          Great!
        </Button>
      </div>
    </Modal>
  );
};

export default SuccessModal;
