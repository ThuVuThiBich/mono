import { FC, useEffect, useMemo, useState } from 'react';
import styles from './UnstakeModal.module.less';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getUnstakeModal, setUnstakeModal } from 'store/ducks/stake/slice';
import { Divider, message, Space } from 'antd';
import { currencyImgs } from 'assets/images/currency';
import { useTypeSafeTranslation } from 'hooks/useTypeSafeTranslation';
import ConfirmUnstakeModal from './ConfirmUnstakeModal';
import { Undefined } from 'types/util-types';
import { Trans } from 'next-i18next';
import { formatNumber } from 'utils/number';
import bigDecimal from 'js-big-decimal';
import { Avatar, Button, InputSlider, Modal } from '@cross/ui';
import LockInput from 'components/earnAndStake/LockInput';

export interface IPayloadConfirmModal {
  number: number;
  orderId: string;
  coinName: string;
  type: number;
  confirmType: 'cancel' | 'unstake';
}

const UNSTAKE_COOLDOWN: Record<string, number> = {
  ORBS: 14,
  IOST: 3,
  ATOM: 21,
  default: 2,
};

const UnstakeModal: FC = () => {
  const { t } = useTypeSafeTranslation();
  const dispatch = useAppDispatch();
  const unstakeInfo = useAppSelector(getUnstakeModal);
  const [payloadConfirm, setPayloadConfirm] = useState<Undefined<IPayloadConfirmModal>>(undefined);

  const modalType = unstakeInfo?.type === 3 ? 'unstake' : 'cancel';

  const [lockAmount, setLockAmount] = useState({
    slider: 0,
    input: '',
  });

  useEffect(() => {
    if (!unstakeInfo) return;

    // Only unstake can select amount
    if (unstakeInfo.type !== 3) {
      setLockAmount({
        input: unstakeInfo?.max,
        slider: Number(unstakeInfo?.max) * 100,
      });
    }
  }, [unstakeInfo]);

  const handleSubmit = () => {
    if (!unstakeInfo) return;

    if (!lockAmount.input || Number(lockAmount.input) < Number(unstakeInfo?.min)) {
      return message.error(`${'* Minimum Unstake Amount:'} ${unstakeInfo?.min} ${unstakeInfo.coin}`);
    }

    if (Number(lockAmount.input) > Number(unstakeInfo?.max)) {
      return message.error('* Insufficient balance');
    }

    setPayloadConfirm({
      number: Number(lockAmount.input),
      type: unstakeInfo.type,
      coinName: unstakeInfo.coin,
      orderId: unstakeInfo.orderId,
      confirmType: modalType,
    });
    dispatch(setUnstakeModal(undefined));
  };

  const handleClose = () => {
    setLockAmount({ slider: 0, input: '' });
    dispatch(setUnstakeModal(undefined));
  };
  const handleCloseConfirmModal = () => {
    setLockAmount({ slider: 0, input: '' });
    setPayloadConfirm(undefined);
  };

  const hideUnstakeWarning = useMemo(() => {
    return !(modalType === 'unstake' && (unstakeInfo?.coin === 'XCR' || unstakeInfo?.coin === 'ADA'));
  }, [modalType, unstakeInfo]);

  return (
    <>
      <Modal centered width={469} visible={!!unstakeInfo} onCancel={handleClose}>
        <Avatar
          key={unstakeInfo?.coin}
          className={styles.avatar}
          size={50}
          type="secondary"
          src={currencyImgs[unstakeInfo?.coin || ''] || currencyImgs.GENERIC}
        />

        <div className={styles.header}>
          <img alt="earn" src="/images/svgs/conveyor-belt-error.svg" />
          <h1 className="uppercase">{modalType === 'unstake' ? t('stake.unstake') : t('common.cancel')}</h1>
        </div>
        <Divider className={styles.divider}>{unstakeInfo?.coin}</Divider>

        <div className={styles.body}>
          <Space className="w-100" direction="vertical" size={12}>
            <div className="f-between">
              <div className={styles.availableLabel}>
                <img src="/images/svgs/hourglass-start-duotone.svg" alt="hours" />
                <b> Staked Amount</b>
              </div>

              <div className={styles.availableValue}>
                <b>{formatNumber(unstakeInfo?.max, 8)}</b>
                <small>{unstakeInfo?.coin}</small>
              </div>
            </div>

            <LockInput
              label="LOCK AMOUNT"
              disabled={unstakeInfo?.type !== 3}
              value={lockAmount.input}
              onValueChange={(values) => {
                setLockAmount({ input: values.value, slider: (Number(values.value) * 100) / Number(unstakeInfo?.max) });
              }}
              prefix={unstakeInfo?.coin || ''}
              precision={10}
            />

            <InputSlider
              disabled={unstakeInfo?.type !== 3}
              value={lockAmount.slider}
              handleChange={(value: number) => {
                setLockAmount({
                  slider: (value / Number(unstakeInfo?.max)) * 100,
                  input: new bigDecimal(value).getValue(),
                });
              }}
              maxValue={Number(unstakeInfo?.max)}
            />
          </Space>
          {hideUnstakeWarning && (
            <div className={styles.warningBox}>
              <img src="/images/svgs/exclamation-error.svg" alt="exclamation" />
              <span>
                {/* <Trans
                  i18nKey={modalType === 'cancel' ? 'stake.earning_message' : 'stake.unstake_message'}
                  values={{ day: UNSTAKE_COOLDOWN[unstakeInfo?.coin || 'default'] || 2 }}
                /> */}
              </span>
            </div>
          )}
        </div>
        <div className="f-center">
          <Button type="error" onClick={handleSubmit} className={styles.btnSubmit}>
            {modalType === 'unstake' ? 'Unstake' : 'Cancel'}
          </Button>
        </div>
      </Modal>

      {payloadConfirm && (
        <ConfirmUnstakeModal payload={payloadConfirm} visible={!!payloadConfirm} onClose={handleCloseConfirmModal} />
      )}
    </>
  );
};

export default UnstakeModal;
