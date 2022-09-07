import { FC, useState } from 'react';
import styles from './StakeModalConfirm.module.less';
import { Modal } from '@cross/ui';

import { Button } from '@cross/ui';
import { useAppDispatch } from 'hooks';
import { setStakeModal } from 'store/ducks/stake/slice';
import { Col, Divider, message, Row } from 'antd';
import { Avatar } from '@cross/ui';
import { currencyImgs } from 'assets/images/currency';

import { useTypeSafeTranslation } from 'hooks/useTypeSafeTranslation';
import { useMutation } from 'react-query';
import { stakingRequest } from 'api/staking/request';
import { TError } from 'api/types';

import { IStakingParams } from 'api/staking';
import { Surface } from '@cross/ui';
import { Trans } from 'next-i18next';
import { Checkbox } from '@cross/ui/checkbox';

interface Props {
  visible: boolean;
  onClose: () => void;
  payload: IStakingParams;
  min: string;
  apy: string;
}

const StakeModalConfirm: FC<Props> = ({ visible, onClose, payload, min, apy }) => {
  const { t } = useTypeSafeTranslation();
  const dispatch = useAppDispatch();
  const [acceptTerm, setAccepTerm] = useState(false);

  const { mutate, isLoading } = useMutation(stakingRequest, {
    onSuccess: () => {
      message.success('Stake successfully!');
      handleClose();
    },
    onError: (data: TError) => {
      message.error(t(data.msg_code as any, { ns: 'error' }));
    },
  });

  const handleClose = () => {
    dispatch(setStakeModal(false));
    onClose();
  };

  const handleSubmit = async () => {
    if (!acceptTerm) return;
    mutate(payload);
  };

  return (
    <Modal centered width={500} visible={visible} onCancel={handleClose}>
      <Avatar
        className={styles.avatar}
        size={50}
        type="secondary"
        src={currencyImgs[payload?.coinName || 'GENERIC'] || currencyImgs.GENERIC}
      />

      <div className={styles.header}>
        <img alt="earn" src="/images/svgs/conveyor-belt-active.svg" />
        <h1>Stake</h1>
      </div>
      <Divider className={styles.divider}>{payload.coinName}</Divider>

      <div className={styles.body}>
        <Surface className={styles.alert} borderLess>
          <Row gutter={[24, 8]}>
            {/* <Trans
              values={{ min, apy }}
              i18nKey={`stake.stake_notify.${payload.coinName}`}
              components={[
                <Col span={8} className="disabled text-12" key={0} />,
                <Col span={16} className="primary text-12" key={0} />,
              ]}
            /> */}
          </Row>
        </Surface>

        <Checkbox checked={acceptTerm} onChange={(e) => setAccepTerm(e.target.checked)} className={styles.checkbox}>
          <Trans i18nKey="stake.agree_stake_term_2" t={t as any} />
        </Checkbox>
      </div>

      <Button
        loading={isLoading}
        disabled={!acceptTerm}
        onClick={handleSubmit}
        type="info"
        className={styles.btnSubmit}
      >
        Stake
      </Button>
    </Modal>
  );
};

export default StakeModalConfirm;
