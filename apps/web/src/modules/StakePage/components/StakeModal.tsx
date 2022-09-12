import { FC, useEffect, useMemo, useState } from 'react';
import styles from './StakeModal.module.less';
import { Modal } from '@cross/ui';

import { Button } from '@cross/ui';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getSelectedStakeInfo, getStakeModal, setStakeModal } from 'store/ducks/stake/slice';
import { Col, Divider, message, Row, Space } from 'antd';
import { Avatar } from '@cross/ui';
import { currencyImgs } from 'assets/images/currency';
import { InputSlider, SliderStep } from '@cross/ui/inputSlider';
import { Checkbox } from '@cross/ui/checkbox';
import { useTypeSafeTranslation } from 'hooks/useTypeSafeTranslation';
import LockInput from 'components/earnAndStake/LockInput';
// import { Trans } from 'next-i18next';
import { useWalletQuery } from 'api/wallet';
import StakeInfoCard from 'components/earnAndStake/StakeInfoCard';
import { useMarketGroupQuery } from 'api/market';
import { USER_COOKIES } from 'utils/constant';
// import { TERMS_OF_USE } from 'components/Layout/constant';
import { Undefined } from 'types/util-types';
import { IStakingParams } from 'api/staking';
import StakeModalConfirm from './StakeModalConfirm';
import { formatNumber } from 'utils/number';
import bigDecimal from 'js-big-decimal';
import { APY_STAKING_RANGE, COIN_AUTO_COMPOUND } from 'utils/config';
import ToggleCompound from './ToggleCompound';
import { getCookies } from '@cross/cookies';

const COIN_WITH_DATE_CONFIG = ['AVAX', 'IOTX'];

const StakeModal: FC = () => {
  const { t } = useTypeSafeTranslation();
  const dispatch = useAppDispatch();
  const visible = useAppSelector(getStakeModal);
  const stakeInfo = useAppSelector(getSelectedStakeInfo);
  const { data: walletData, refetch } = useWalletQuery();
  const { data: marketData, refetch: refetchMarketData } = useMarketGroupQuery();
  const [payload, setPayload] = useState<Undefined<IStakingParams>>();

  const [acceptTerm, setAccepTerm] = useState(false);
  const [lockAmount, setLockAmount] = useState({
    slider: 0,
    input: '',
  });

  const [lockDate, setLockDate] = useState('');

  const language = getCookies(USER_COOKIES.language);

  const getLink = (type: { [key: string]: string }) => {
    return type?.[language] || type.en;
  };

  useEffect(() => {
    if (!stakeInfo) return;
    refetch();
    refetchMarketData();
  }, [stakeInfo]);

  useEffect(() => {
    if (!visible) {
      setPayload(undefined);
      setAccepTerm(false);
      setLockAmount({ slider: 0, input: '' });
      setLockDate('');
    }
  }, [visible]);

  const handleClose = () => {
    dispatch(setStakeModal(false));
  };

  const withDateStaking = useMemo(() => {
    return COIN_WITH_DATE_CONFIG.includes(String(stakeInfo?.coin));
  }, [stakeInfo]);

  const wallet = useMemo(() => {
    if (!stakeInfo) return walletData?.coins[0];
    return walletData?.coins.find((x) => x.coinType === stakeInfo?.coin);
  }, [stakeInfo, walletData]);

  const handleSubmit = async () => {
    if (Number(lockAmount.input) < Number(stakeInfo?.min)) {
      return message.error(`${'* Min stake amount:'} ${stakeInfo?.min}`);
    }

    if (Number(lockAmount.input) > Number(wallet?.number)) {
      return message.error(`${'* Insufficient balance'}`);
    }

    if (sliderProps.stepper) {
      if (Number(lockAmount.input) % 32 !== 0) {
        return message.error(t(`e_ERROR_MIN_ETH` as any, { ns: 'error' }));
      }
    }

    if (withDateStaking) {
      if (Number(lockDate) < Number(stakeInfo?.minTimeAutoRelease)) {
        return message.error(
          t(`e_ERROR_MIN_STAKE_DATE` as any, { ns: 'error', value: Number(stakeInfo?.minTimeAutoRelease) })
        );
      }
      if (Number(lockDate) > Number(stakeInfo?.maxTimeAutoRelease)) {
        return message.error(
          t(`e_ERROR_MAX_STAKE_DATE` as any, { ns: 'error', value: Number(stakeInfo?.maxTimeAutoRelease) })
        );
      }
    }

    const payload: IStakingParams = {
      num: lockAmount.input,
      coinName: stakeInfo?.coin as string,
      type: Number(stakeInfo?.type),
    };
    if (withDateStaking) payload.timeAutoRelease = lockDate;

    setPayload(payload);
  };

  const coinMarket = useMemo(() => {
    if (!stakeInfo || !marketData) return { price: 0, coinPrecision: 15 };
    const pair = `${stakeInfo.coin}_USDT`;
    const coin = marketData.find((x) => x.pair === pair);
    return { price: Number(coin?.lastTradePrice) || 0, coinPrecision: Number(coin?.coinPrecision) || 15 };
  }, [marketData, stakeInfo]);

  const sliderProps = useMemo(() => {
    const isStepper = stakeInfo?.coin === 'ETH';

    return {
      stepper: isStepper,
      step: 32,
    };
  }, [stakeInfo]);

  if (!stakeInfo) return null;

  return (
    <>
      <Modal centered width={778} visible={visible && !payload} onCancel={handleClose}>
        <Avatar
          className={styles.avatar}
          size={50}
          type="secondary"
          key={stakeInfo.coin}
          src={currencyImgs[stakeInfo.coin] || currencyImgs.GENERIC}
        />

        <div className={styles.header}>
          <img alt="earn" src="/images/svgs/conveyor-belt-active.svg" />
          <h1>Stake</h1>
        </div>
        <Divider className={styles.divider}>{stakeInfo.coin}</Divider>

        <div className={styles.body}>
          <Row gutter={[18, 18]}>
            <Col lg={14}>
              <Space className="w-100" direction="vertical" size={12}>
                <div className="f-between">
                  <div className={styles.availableLabel}>
                    <img src="/images/svgs/wallet.svg" alt="wallet" />
                    <span>Available</span>
                  </div>

                  <div className={styles.availableValue}>
                    <b>{formatNumber(wallet?.number, 8) || 0}</b>
                    <small>{stakeInfo.coin}</small>
                  </div>
                </div>

                {withDateStaking && (
                  <LockInput
                    label="Date to be Staked"
                    value={lockDate}
                    onValueChange={(values) => {
                      setLockDate(values.value);
                    }}
                    prefix={(Number(lockDate) > 1 ? 'days' : 'day').toUpperCase()}
                    precision={'0'}
                    isAllowed={({ floatValue, value }: any) => {
                      if (String(value).includes('.')) return false;
                      if (!floatValue) return true;
                      return floatValue <= Number(stakeInfo.maxTimeAutoRelease);
                    }}
                  />
                )}

                <LockInput
                  label="LOCK AMOUNT"
                  value={lockAmount.input}
                  onValueChange={(values) => {
                    setLockAmount({
                      input: values.value,
                      slider: sliderProps.stepper
                        ? Number(values.value)
                        : (Number(values.value) * 100) / Number(wallet?.number),
                    });
                  }}
                  prefix={stakeInfo?.coin || ''}
                  precision={coinMarket.coinPrecision}
                />

                {/* ETH value */}
                {sliderProps.stepper ? (
                  <SliderStep
                    value={lockAmount.slider}
                    handleChange={(value: number) => {
                      setLockAmount({ slider: value, input: value.toString() });
                    }}
                    maxValue={Math.floor(Number(wallet?.number) / sliderProps.step) * sliderProps.step}
                    step={sliderProps.step}
                  />
                ) : (
                  <InputSlider
                    value={lockAmount.slider}
                    handleChange={(value: number) => {
                      setLockAmount({
                        slider: (value / Number(wallet?.number)) * 100,
                        input: new bigDecimal(value).getValue(),
                      });
                    }}
                    maxValue={Number(wallet?.number)}
                  />
                )}

                <div className={styles.minMaxWrap}>
                  <Space wrap size={[18, 0]}>
                    {withDateStaking && (
                      <>
                        <div className={styles.minMaxBox}>
                          <span>Min</span>
                          <span>{stakeInfo.minTimeAutoRelease}</span>
                          <small>{stakeInfo.minTimeAutoRelease > 1 ? 'days' : 'day'}</small>
                        </div>
                        <div className={styles.minMaxBox}>
                          <span>Max</span>
                          <span>{stakeInfo.maxTimeAutoRelease}</span>
                          <small>{stakeInfo.maxTimeAutoRelease > 1 ? 'days' : 'day'}</small>
                        </div>
                      </>
                    )}

                    <div className={styles.minMaxBox}>
                      <span>Min</span>
                      <span>{stakeInfo.min || 0}</span>
                      <small>{stakeInfo.coin}</small>
                    </div>
                  </Space>
                </div>
              </Space>

              <Space size={15} align="start">
                <img src="/images/svgs/asterisk-solid.svg" alt="asterisk-solid" />
                <span className="text-12 disabled">
                  Rewards come in daily. Rewards are given directly to the wallet (they show up in the wallet, but
                  cannot be traded or withdrawn)
                </span>
              </Space>

              {stakeInfo.coin === 'ORBS' && (
                <Space size={15} align="start">
                  <img src="/images/svgs/asterisk-solid.svg" alt="asterisk-solid" />
                  <span className="text-12 disabled">orbs Stake Warning</span>
                </Space>
              )}

              <Checkbox
                checked={acceptTerm}
                onChange={(e) => setAccepTerm(e.target.checked)}
                className={styles.checkbox}
              >
                I have read and I agree to Terms of Use
              </Checkbox>

              {COIN_AUTO_COMPOUND.includes(stakeInfo.coin) && (
                <div className={styles.orbsToggle}>
                  <ToggleCompound withIcon withLabel coin={stakeInfo.coin} />
                </div>
              )}
            </Col>
            <Col lg={10}>
              <StakeInfoCard stakeInfo={stakeInfo} stakedDate={lockDate} />
            </Col>
          </Row>
        </div>

        <Button disabled={!acceptTerm} onClick={handleSubmit} type="info" className={styles.btnSubmit}>
          Stake
        </Button>
      </Modal>
      {payload && (
        <StakeModalConfirm
          min={stakeInfo.min}
          apy={APY_STAKING_RANGE[stakeInfo.coin] || 'N/A'}
          visible={!!payload}
          payload={payload}
          onClose={() => setPayload(undefined)}
        />
      )}
    </>
  );
};

export default StakeModal;
