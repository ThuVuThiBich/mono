import React, { FC } from 'react';
import styles from './HeaderInfo.module.less';
import { Row, Col, Space } from 'antd';
// import { PercentIndicator } from 'components/Statistic';
import { useAppSelector, useTypeSafeTranslation } from 'hooks';
import { getCurrentCurrency } from 'store/ducks/account/slice';
import { useUserStakingInfo } from 'api/staking';
import { formatNumber, formatNumberFixed } from 'utils/number';
import BigNumber from 'bignumber.js';

const HeaderInfo: FC = () => {
  const { t } = useTypeSafeTranslation();
  const currency = useAppSelector(getCurrentCurrency);
  const { data } = useUserStakingInfo('all');

  return (
    <div className={styles.root}>
      <h1>Your Earnings Portfolio</h1>
      <Row className={styles.body} justify="space-between" align="top" gutter={[4, 4]}>
        <Col>
          <div className="disabled-3">Locked Staking Balance:</div>
          <Space size={0} direction="vertical" align="end">
            <div className={styles.lockedBalance}>
              {formatNumberFixed(data?.lockedStakingBalanceBTC || 0)} <span>BTC</span>
            </div>
            <div className={styles.lockedBalanceExchange}>
              ~{currency.symbol}{' '}
              {formatNumber(
                new BigNumber(data?.lockedStakingBalanceUSDT || 0).multipliedBy(Number(currency.rate)).toString(),
                2
              )}{' '}
              {currency.coinType}
            </div>
          </Space>
        </Col>
        <Col>
          {/* <div className={styles.pnlBox}>
            <p className="disabled">{t('stake.cumulative_PNL')}</p>
            <Space direction="vertical" align="end">
              <div className={styles.pnl}>{currency.symbol} 0</div>
              <PercentIndicator className={styles.percent} value={`0%`} />
            </Space>
          </div> */}
        </Col>
      </Row>
    </div>
  );
};

export default HeaderInfo;
