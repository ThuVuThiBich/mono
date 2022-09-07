import React, { FC, useState } from 'react';
import styles from './CardSection.module.less';
import { Col, Row, Spin } from 'antd';
import { Card } from 'components/earnAndStake';
import { useTypeSafeTranslation } from 'hooks/useTypeSafeTranslation';
import { useStakingInfo } from '../hooks/useStakingInfo';
import { IStakingInfo } from 'api/staking';
import { useAppDispatch } from 'hooks';
import { setSelectedStakeInfo, setStakeModal } from 'store/ducks/stake/slice';
import { setAuthModal } from 'store/ducks/system/slice';
import ToggleCompound from './ToggleCompound';
import { COIN_AUTO_COMPOUND } from 'utils/config';
import { FilterGroup } from '@cross/ui';
import { useRouter } from 'next/router';
import { routes } from 'types/routes';
import { useUser } from 'api/account';

const CardSection: FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTypeSafeTranslation();
  const { user } = useUser();
  const [filter, setFilter] = useState<'popular' | 'APY'>('popular');
  const { data, isLoading, getStakeAPYRange, getStakeInfoByTime } = useStakingInfo();
  const router = useRouter();
  const handleStake = (data: IStakingInfo, coin: string) => {
    if (!user) {
      router.push(`${routes.login}?redirect=stake`);
      return;
    }
    dispatch(setSelectedStakeInfo({ ...data, coin }));
    dispatch(setStakeModal(true));
  };

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>Best Stake Rates for Your Crypto Savings</h1>
        <p>Pick your cryptocurrency out of 10+ Earning options.</p>
      </div>

      <div className={styles.body}>
        <div className={styles.filterGroup}>
          <FilterGroup
            datas={[
              { label: 'popular', value: 'popular' },
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
                data={getStakeInfoByTime(data[item], 1)}
                coin={item}
                apyRange={getStakeAPYRange(item)}
                type="stake"
                onClick={handleStake}
              >
                {COIN_AUTO_COMPOUND.includes(item) && (
                  <div className={styles.orbsToggle}>
                    <ToggleCompound withLabel coin={item} />
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default CardSection;
