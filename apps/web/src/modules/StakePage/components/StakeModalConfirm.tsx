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
            Rewards come in daily. Rewards are given directly to the wallet (they show up in the wallet, but cannot be
            traded or withdrawn)
            <Col span={8} className="disabled text-12">
              Minimum:
            </Col>
            <Col span={16} className={styles.warning}>
              32 ETH. Can stake in blocks of 32 ETH each.
            </Col>
            <Col span={8} className="disabled text-12">
              Restrictions:
            </Col>
            <Col span={16} className={styles.warning}>
              cannot Unstake; rewards are not accessible or withdrawable; rewards not compounded
            </Col>
            <Col span={8} className="disabled text-12">
              APR:
            </Col>
            <Col span={16} className={styles.warning}>
              ~ 4% paid daily, directly to the staked wallet address
            </Col>
            <Col span={8} className="disabled text-12">
              Ethereum 2.0 note:
            </Col>
            <Col span={16} className={styles.warning}>
              Staked coins cannot be unstaked until the official launch of Ethereum 2.0.
            </Col>
            <Col span={8} className="disabled text-12">
              Process Time:
            </Col>
            <Col span={16} className={styles.warning}>
              daily cutoff of 6:00 UTC
            </Col>
          </Row>
        </Surface>

        <Checkbox checked={acceptTerm} onChange={(e) => setAccepTerm(e.target.checked)} className={styles.checkbox}>
          I have read and I agree to Terms of Use
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
