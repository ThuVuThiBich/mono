import React, { FC, useMemo } from 'react';
import styles from './StakeInfoSection.module.less';
import { Surface } from '@cross/ui';
import { Col, Row, Space, Spin } from 'antd';
import Link from 'next/link';
import { routes } from 'types/routes';
import { useAppSelector, useTypeSafeTranslation } from 'hooks';
import { getCurrentCurrency } from 'store/ducks/account/slice';
import { useUserStakingInfo } from 'api/staking';
import { formatNumber, formatNumberFixed } from 'utils/number';
import { Avatar } from '@cross/ui';
import { currencyImgs } from 'assets/images/currency';

const StakeInfoSection: FC = () => {
  const { t } = useTypeSafeTranslation();
  const currentCurrency = useAppSelector(getCurrentCurrency);
  const { data, isLoading } = useUserStakingInfo('staking');

  const coins = useMemo(() => {
    const datas = { ...data };
    delete datas.lockedStakingBalanceBTC;
    delete datas.numberToken;
    delete datas.lockedStakingBalanceUSDT;
    delete datas.pnl;

    return Object.keys(datas);
  }, [data]);

  // const usdPrice = useMemo(() => {
  //   if (!data) return 0;

  //   const orbs = Number(data['ORBS'] || 0);
  //   if (orbs) {
  //     return new BigNumber(orbs)
  //       .multipliedBy(orbsPrice?.price || 0)
  //       .plus(data?.lockedStakingBalanceUSDT)
  //       .toString();
  //   }
  //   return data?.lockedStakingBalanceUSDT;
  // }, [data, orbsPrice]);

  return (
    <Surface borderMd className={styles.root}>
      <Spin spinning={isLoading} className={styles.loading} />
      <Row className={styles.row} justify="space-between" align="top" gutter={[16, 16]}>
        <Col className={styles.balance}>
          <p>Locked Staking Balance:</p>
          <Space className={styles.balanceWrap} size={0} direction="vertical" align="end">
            {coins.map((coin) => (
              <div key={coin} className={styles.lockedBalance}>
                {/* {data && data[coin]} */}
                {formatNumberFixed((data && data[coin]) || 0, 2)} <span>{coin}</span>
              </div>
            ))}
            <div className={styles.lockedBalanceExchange}>
              ~{currentCurrency.symbol}{' '}
              {formatNumber(Number(data?.lockedStakingBalanceUSDT || 0) * Number(currentCurrency.rate), 2)}{' '}
              {currentCurrency.coinType}
            </div>
          </Space>
        </Col>
        <Col className={styles.token}>
          <p>Staked Tokens:</p>
          <div className={styles.stakedToken}>
            <Space>
              {coins.length === 0 && <h1 className="white m-0">-</h1>}
              {coins.map((coin) => (
                <Avatar key={coin} size={32} type="secondary" src={currencyImgs[coin] || currencyImgs.GENERIC} />
              ))}
            </Space>
          </div>
        </Col>
        <Col className={styles.right}>
          <Link href={routes.earnings} passHref>
            <button className={styles.portfolioButton}>
              Your Earnings Portfolio
              <img src="/images/svgs/arrow-from-bottom-solid.svg" alt="arrow" />
            </button>
          </Link>
        </Col>
      </Row>
    </Surface>
  );
};

export default StakeInfoSection;
