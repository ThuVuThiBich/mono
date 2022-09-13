import React, { FC, useState } from 'react';
import styles from './CardSection.module.less';
import { Col, Row, Spin } from 'antd';
import { useTypeSafeTranslation } from 'hooks/useTypeSafeTranslation';
import { setEarnModal, setSelectedStakeInfo } from 'store/ducks/stake/slice';
import { useEarnInfo } from '../hooks/useEarnInfo';
import { useAppDispatch } from 'hooks';
import { IStakingInfo } from 'api/staking';
import { setAuthModal } from 'store/ducks/system/slice';
import { Card } from 'components/earnAndStake';
import { FilterGroup } from '@cross/ui';
import { routes } from 'types/routes';
import { useRouter } from 'next/router';
import { useUser } from 'api/account';

const CardSection: FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTypeSafeTranslation();
  const { user } = useUser();

  const [filter, setFilter] = useState<'popular' | 'APY'>('popular');
  const router = useRouter();
  const { data, isLoading, getStakeInfoByMaxAPY, getStakeAPYRange } = useEarnInfo();

  const handleEarn = (data: IStakingInfo, coin: string) => {
    if (!user) {
      router.push(`${routes.login}?redirect=stake`);
      return;
    }

    dispatch(setSelectedStakeInfo({ ...data, coin }));
    dispatch(setEarnModal(true));
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>Best ULT Earn Rates for Your Crypto Savings</h1>
        <p>Pick your cryptocurrency out of 10+ Earning options.</p>
      </div>

      <div className={styles.body}>
        <div className={styles.filterGroup}>
          <FilterGroup
            datas={[
              { label: 'Popular', value: 'popular' },
              { label: 'Max APY/APR', value: 'APY' },
            ]}
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          />
        </div>

        {isLoading && (
          <div className="f-center">
            <Spin />
          </div>
        )}

        <Row justify="center" gutter={[24, 32]} className={styles.cardWrap}>
          {Object.keys(data).map((item) => (
            <Col xs={12} sm={12} md={6} lg={6} key={item}>
              <Card
                data={getStakeInfoByMaxAPY(data[item])}
                coin={item}
                apyRange={getStakeAPYRange(data[item])}
                type="earn"
                onClick={handleEarn}
              />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default CardSection;
