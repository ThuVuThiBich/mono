import { FC, useMemo } from 'react';
import styles from './RedeemModal.module.less';
import { Divider, message, Space } from 'antd';
import { currencyImgs } from 'assets/images/currency';
import { useTypeSafeTranslation } from 'hooks/useTypeSafeTranslation';
import { Trans } from 'next-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { unlockStakingRequest } from 'api/staking/request';
import { TError } from 'api/types';
import numeral from 'numeral';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getRedeemModal, setRedeemModal } from 'store/ducks/stake/slice';
import { Avatar, Button, Modal } from '@cross/ui';

const RedeemModal: FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTypeSafeTranslation();
  const queryClient = useQueryClient();
  const payload = useAppSelector(getRedeemModal);

  const { mutate, isLoading } = useMutation(unlockStakingRequest, {
    onSuccess: () => {
      message.success('Redeem successfully!');
      queryClient.invalidateQueries('/user/mine/lockInfo');
      onClose();
    },
    onError: (error: TError) => {
      message.error(t(error.msg_code as any, { ns: 'error' }));
    },
  });

  const onClose = () => {
    dispatch(setRedeemModal(undefined));
  };

  const handleConfirm = () => {
    if (!payload) return;
    mutate({
      number: payload.number,
      coinName: payload.coinName,
      orderId: Number(payload.orderId) === 0 ? '' : payload.orderId,
      type: payload.type,
    });
  };

  const coinName = useMemo(() => {
    if (!payload) return;

    return payload?.type === 2999 ? 'XCRS' : payload.coinName;
  }, [payload]);

  return (
    <Modal centered width={283} visible={!!payload} onCancel={onClose}>
      <Avatar
        key={coinName}
        className={styles.avatar}
        size={50}
        type="secondary"
        src={currencyImgs[coinName || ''] || currencyImgs.GENERIC}
      />

      <Divider className={styles.divider}>{coinName}</Divider>

      <div className={styles.body}>
        <div className="bold center">
          {/* <Trans i18nKey={'stake.review_your_redeem'} t={t as any} components={[<b className="success" key="1" />]} /> */}
        </div>

        <div className={styles.warningBox}>
          <Space direction="vertical" size={8}>
            {/* <Trans
              i18nKey={'stake.you_are_about_to_redeem'}
              t={t as any}
              components={[<b className="success" key="1" />]}
            /> */}
            <div className="white text-12">
              {numeral(payload?.number).format(`0,0[.][0000000000000000000]`)} {payload?.coinName}
            </div>
            {/* <Trans i18nKey={'stake.unstake_notify'} t={t as any} components={[<b className="success" key="1" />]} /> */}
          </Space>

          <div>Do you really want to Redeem?</div>
        </div>
      </div>

      <Button loading={isLoading} onClick={handleConfirm} type="success" className={styles.btnSubmit}>
        {t('common.confirm')}
      </Button>
    </Modal>
  );
};

export default RedeemModal;
