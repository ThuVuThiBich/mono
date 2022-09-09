import { FC, useEffect, useMemo, useState } from 'react';
import styles from './EarnModal.module.less';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getEarnModal, getSelectedStakeInfo, setEarnModal } from 'store/ducks/stake/slice';
import { Col, Divider, message, Row, Space } from 'antd';
import { currencyImgs } from 'assets/images/currency';
import { useTypeSafeTranslation } from 'hooks/useTypeSafeTranslation';
import { useWalletQuery } from 'api/wallet';
import { useMutation } from 'react-query';
import { stakingRequest } from 'api/staking/request';
import { TError } from 'api/types';
import { useEarnInfo } from '../hooks/useEarnInfo';
import { useMarketGroupQuery } from 'api/market';
import { formatNumber } from 'utils/number';
import { Trans } from 'next-i18next';
import { USER_COOKIES } from 'utils/constant';
import bigDecimal from 'js-big-decimal';
import { Avatar, Button, Checkbox, InputSlider, Modal } from '@cross/ui';
import { RadioDuration } from 'components/earnAndStake';
import StakeInfoCard from 'components/earnAndStake/StakeInfoCard';
import LockInput from 'components/earnAndStake/LockInput';
import { TERMS_OF_USE } from 'components/layout/constant';
import { getCookies } from '@cross/cookies';

const EarnModal: FC = () => {
  const { t } = useTypeSafeTranslation();
  const dispatch = useAppDispatch();
  const visible = useAppSelector(getEarnModal);
  const initStakeInfo = useAppSelector(getSelectedStakeInfo);
  const { data: walletData, refetch } = useWalletQuery();
  const { data: stakeDatas, getStakeInfoByTime } = useEarnInfo();
  const [duration, setDuration] = useState(30);
  const { data: marketData, refetch: refetchMarketData } = useMarketGroupQuery();

  useEffect(() => {
    if (!initStakeInfo) return;
    setDuration(initStakeInfo?.time || 30);
    refetch();
    refetchMarketData();
  }, [initStakeInfo]);

  const stakeInfo = useMemo(() => {
    if (!stakeDatas || !initStakeInfo?.coin || !duration) return undefined;
    return {
      ...getStakeInfoByTime(stakeDatas[initStakeInfo.coin as any], duration),
      coin: initStakeInfo?.coin || '',
    };
  }, [stakeDatas, initStakeInfo, duration]);

  const [acceptTerm, setAccepTerm] = useState(false);
  const [lockAmount, setLockAmount] = useState({
    slider: 0,
    input: '',
  });

  const { mutate, isLoading } = useMutation(stakingRequest, {
    onSuccess: () => {
      message.success(t('stake.earn_successfully'));
      handleClose();
    },
    onError: (data: TError) => {
      message.error(t(data.msg_code as any, { ns: 'error' }));
    },
  });

  useEffect(() => {
    if (!visible) {
      setAccepTerm(false);
      setLockAmount({ slider: 0, input: '' });
    }
  }, [visible]);

  const handleClose = () => {
    dispatch(setEarnModal(false));
  };

  const wallet = useMemo(() => {
    if (!stakeInfo) return walletData?.coins[0];
    return walletData?.coins.find((x) => x.coinType === stakeInfo?.coin);
  }, [stakeInfo, walletData]);

  const handleSubmit = async () => {
    if (Number(lockAmount.input) < Number(stakeInfo?.min)) {
      return message.error(`${'* Min earn amount:'}  ${Number(stakeInfo?.min)} ${stakeInfo?.coin} `);
    }

    if (Number(lockAmount.input) > Number(maxEarn)) {
      return message.error(`${'* Max earn amount:'} ${Number(maxEarn)} ${stakeInfo?.coin} `);
    }

    mutate({
      num: lockAmount.input,
      coinName: stakeInfo?.coin as string,
      type: Number(stakeInfo?.type),
    });
  };

  const coinMarket = useMemo(() => {
    if (!stakeInfo || !marketData) return { price: 0, coinPrecision: 15 };
    const pair = `${stakeInfo.coin}_USDT`;
    const coin = marketData.find((x) => x.pair === pair);
    return { price: Number(coin?.lastTradePrice) || 0, coinPrecision: Number(coin?.coinPrecision) || 15 };
  }, [marketData, stakeInfo]);

  const maxEarn = useMemo(() => {
    if (!stakeInfo?.individualMaxLimit) return Number(wallet?.number);
    return Number(stakeInfo?.individualMaxLimit);
  }, [stakeInfo]);

  const handleChangeDuration = (e: any) => {
    setDuration(e.target.value);
    setLockAmount({ slider: 0, input: '' });
  };

  const language = getCookies(USER_COOKIES.language);

  const getLink = (type: { [key: string]: string }) => {
    return type?.[language] || type.en;
  };

  if (!initStakeInfo?.coin) return null;
  return (
    <Modal centered width={768} visible={visible} onCancel={handleClose}>
      <Avatar
        className={styles.avatar}
        size={50}
        type="secondary"
        key={stakeInfo?.coin}
        src={currencyImgs[stakeInfo?.coin || 'GENERIC'] || currencyImgs.GENERIC}
      />

      <div className={styles.header}>
        <img alt="earn" src="/images/svgs/conveyor-belt-active.svg" />
        <h1>ULT Earn</h1>
      </div>
      <Divider className={styles.divider}>{stakeInfo?.coin}</Divider>

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
                  <small>{stakeInfo?.coin}</small>
                </div>
              </div>

              <LockInput
                label="LOCK AMOUNT"
                value={lockAmount.input}
                onValueChange={(values) => {
                  setLockAmount({ input: values.value, slider: (Number(values.value) * 100) / maxEarn });
                }}
                precision={coinMarket.coinPrecision}
                prefix={stakeInfo?.coin || ''}
              />

              <InputSlider
                value={lockAmount.slider}
                handleChange={(value: number) => {
                  setLockAmount({ slider: (value / maxEarn) * 100, input: new bigDecimal(value).getValue() });
                }}
                maxValue={maxEarn}
              />

              <div className="f-end">
                <Space size={18}>
                  <div className={styles.minMaxBox}>
                    <span>Min</span>
                    <span>{Number(stakeInfo?.min || 0)}</span>
                    <small>{stakeInfo?.coin}</small>
                  </div>
                  {stakeInfo?.individualMaxLimit && (
                    <div className={styles.minMaxBox}>
                      <span>Max</span>
                      <span>{stakeInfo?.individualMaxLimit || 0}</span>
                      <small>{stakeInfo.coin}</small>
                    </div>
                  )}
                </Space>
              </div>
            </Space>

            <div className={styles.durationWrap}>
              <div>
                <img src="/images/svgs/hourglass-start-duotone.svg" alt="hours" />
                <b className="uppercase">PLAN</b>
              </div>

              <Space>
                <RadioDuration value={duration} onChange={handleChangeDuration} size="small" />
                <span className="disabled"> D</span>
              </Space>
            </div>

            <Checkbox checked={acceptTerm} onChange={(e) => setAccepTerm(e.target.checked)}>
              {/* <Trans
                i18nKey="stake.agree_stake_term"
                t={t as any}
                components={[<a key="1" href={getLink(TERMS_OF_USE)} target="_blank" rel="noopener noreferrer" />]}
              /> */}
            </Checkbox>
          </Col>
          <Col lg={10}>
            <StakeInfoCard stakeInfo={stakeInfo} />
          </Col>
        </Row>
      </div>

      <Button
        loading={isLoading}
        disabled={!acceptTerm}
        onClick={handleSubmit}
        type="info"
        className={styles.btnSubmit}
      >
        Earn
      </Button>
    </Modal>
  );
};

export default EarnModal;
