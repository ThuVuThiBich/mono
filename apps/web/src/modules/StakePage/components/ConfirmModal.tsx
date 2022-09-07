import { FC } from 'react';
import styles from './ConfirmModal.module.less';
import { Modal } from '@cross/ui';

import { Button } from '@cross/ui';
import { Divider } from 'antd';
import { Avatar } from '@cross/ui';
import { currencyImgs } from 'assets/images/currency';
import { useTypeSafeTranslation } from 'hooks/useTypeSafeTranslation';

interface Props {
  visible: boolean;
  onClose: () => void;
  isLoading: boolean;
  onSubmit: () => void;
  payload: {
    coinName: string;
    isActive?: boolean;
  };
}

const ConfirmModal: FC<Props> = ({ payload, visible, onClose, isLoading, onSubmit }) => {
  const { t } = useTypeSafeTranslation();

  return (
    <Modal centered width={343} visible={visible} onCancel={onClose}>
      <Avatar
        key={payload.coinName}
        className={styles.avatar}
        size={50}
        type="secondary"
        src={currencyImgs[payload.coinName || ''] || currencyImgs.GENERIC}
      />

      <Divider className={styles.divider}>{payload.coinName}</Divider>

      <div className={styles.body}>
        <div className="bold center"></div>

        <div className={styles.warningBox}>
          <div>Rewards will not be Auto-compounded if you turn it off. Do you want to turn it off?</div>
        </div>
      </div>

      <Button loading={isLoading} onClick={onSubmit} type="error" className={styles.btnSubmit}>
        {t('common.confirm')}
      </Button>
    </Modal>
  );
};

export default ConfirmModal;
