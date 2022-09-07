import { FilterGroup } from '@cross/ui';
import { Col, Row, Space, Typography } from 'antd';
import { PriceCharts } from 'components/priceCharts';
import { useTranslation } from 'next-i18next';
import { FC, useState } from 'react';
import MainMarket from './components/MainMarket';
import styles from './styles.module.less';

const MarketPage: FC = () => {
  const { t } = useTranslation();
  type IFilterType = 'all' | 'gainer' | 'loser';
  const [filterType, setFilterType] = useState<IFilterType>('all');

  return (
    <div className={styles.root}>
      <Row justify="center">
        <Col xs={23} lg={24}>
          <div className={styles.titleContent}>
            <Typography.Title className="bolder text-45" level={1}>
              Buy crypto at true cost
            </Typography.Title>
            <Typography.Paragraph className={styles.subtitle}>
              Don’t bother with trading. Buy the crypto you want in seconds!
            </Typography.Paragraph>
            <div className={styles.filterWrapper}>
              <Space size={20}>
                <FilterGroup
                  datas={[
                    { label: 'Popular', value: 'all' },
                    { label: 'Top Gainers', value: 'gainer' },
                    { label: 'Top Losers', value: 'loser' },
                  ]}
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                />
              </Space>
            </div>
          </div>
          <div className={styles.chartWrapper}>
            <PriceCharts type={filterType} />
          </div>
          <div className={styles.mainMarket}>
            <MainMarket />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default MarketPage;
