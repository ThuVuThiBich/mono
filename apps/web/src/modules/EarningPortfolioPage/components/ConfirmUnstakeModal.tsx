import { FC } from 'react';
import styles from './ConfirmUnstakeModal.module.less';
import { Divider, message, Space } from 'antd';
import { currencyImgs } from 'assets/images/currency';
import { useTypeSafeTranslation } from 'hooks/useTypeSafeTranslation';
import { Trans } from 'next-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { unlockStakingRequest } from 'api/staking/request';
import { TError } from 'api/types';
import { IPayloadConfirmModal } from './UnstakeModal';
import { formatNumber } from 'utils/number';
import { Avatar, Button, Modal } from '@cross/ui';

interface IConfirmUnstakeModal {
  visible: boolean;
  onClose: () => void;
  payload: IPayloadConfirmModal;
}

const ConfirmUnstakeModal: FC<IConfirmUnstakeModal> = ({ payload, visible, onClose }) => {
  const { t } = useTypeSafeTranslation();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(unlockStakingRequest, {
    onSuccess: () => {
      message.success(payload.confirmType === 'cancel' ? 'Cancel earning successfully!' : 'Unstake successfully!');
      queryClient.invalidateQueries('/user/mine/lockInfo');
      onClose();
    },
    onError: (error: TError) => {
      message.error(t(error.msg_code as any, { ns: 'error' }));
    },
  });

  const handleConfirm = () => {
    mutate({
      number: payload.number,
      coinName: payload.coinName,
      orderId: Number(payload.orderId) === 0 ? '' : payload.orderId,
      type: payload.type,
    });
  };

  return (
    <Modal centered width={283} visible={visible} onCancel={onClose}>
      <Avatar
        key={payload.coinName}
        className={styles.avatar}
        size={50}
        type="secondary"
        src={currencyImgs[payload.coinName || ''] || currencyImgs.GENERIC}
      />

      <Divider className={styles.divider}>{payload.coinName}</Divider>

      <div className={styles.body}>
        <div className="bold center">
          {/* <Trans
            i18nKey={payload.confirmType === 'unstake' ? 'stake.review_your_unstake' : 'stake.review_your_cancel'}
            t={t as any}
            components={[<b className="error-light" key="1" />]}
          /> */}
        </div>

        <div className={styles.warningBox}>
          <Space direction="vertical" size={8}>
            {/* <Trans
              i18nKey={
                payload.confirmType === 'unstake' ? 'stake.you_are_about_to_unstake' : 'stake.you_are_about_to_cancel'
              }
              t={t as any}
              components={[<b className="error-light" key="1" />]}
            /> */}
            <div className="white text-12">
              {formatNumber(payload.number, 8)} {payload.coinName}
            </div>
            {/* <Trans
              i18nKey={payload.confirmType === 'unstake' ? 'stake.unstake_notify' : 'stake.cancel_notify'}
              t={t as any}
              components={[<b className="error-light" key="1" />]}
            /> */}
          </Space>

          <div>
            {payload.confirmType === 'unstake' ? 'Do you really want to Unstake?' : '"Do you really want to Cancel?'}
          </div>
        </div>
      </div>
      <div className="f-center">
        <Button loading={isLoading} onClick={handleConfirm} type="error" className={styles.btnSubmit}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmUnstakeModal;
