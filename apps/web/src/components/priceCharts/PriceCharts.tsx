import { FC, useMemo } from 'react';
import styles from './PriceCharts.module.css';
import { CoinCard } from 'components/coinCard';
import { useMarketGroupQuery } from 'api/market';
import { MarketGroupItem } from 'api/market/types';
import { useRouter } from 'next/router';
import { routes } from 'types/routes';
import { Col, Row } from 'antd';
import { Carousel } from '@cross/ui';
interface PriceChartsProps {
  type?: 'all' | 'gainer' | 'loser';
  render?: 'carousel' | 'all';
}

const PAIR_TO_SHOW = ['BTC_USDT', 'ETH_USDT', 'ORBS_USDT', 'IOTX_USDT'];

const normalizeData = (data: MarketGroupItem[] | undefined, type: PriceChartsProps['type']) => {
  if (type === 'gainer') {
    return data?.filter((item) => item.moneyType === 'USDT' && parseFloat(item.dailyPriceChangePercent) > 0);
  } else if (type === 'loser') {
    return data?.filter((item) => item.moneyType === 'USDT' && parseFloat(item.dailyPriceChangePercent) < 0);
  }
  return data?.filter((item) => item.moneyType === 'USDT');
};

export const PriceCharts: FC<PriceChartsProps> = ({ type = 'all', render = 'all' }) => {
  const router = useRouter();

  const { data } = useMarketGroupQuery({
    refetchInterval: 10000,
  });

  const handleCoinClick = (pair: string) => {
    router.push(`${routes.exchange}/${pair}`);
  };

  const datas = useMemo(() => {
    return data?.filter((item) => PAIR_TO_SHOW.includes(item.pair));
  }, [data, type]);

  return (
    <section className="container">
      {render === 'carousel' && (
        <Carousel
          arrows={false}
          dots={false}
          rows={2}
          slidesPerRow={4}
          className={styles.root}
          responsive={[
            {
              breakpoint: 1270,
              settings: { rows: 2, slidesPerRow: 3 },
            },
            {
              breakpoint: 960,
              settings: { rows: 1, slidesPerRow: 2 },
            },
            {
              breakpoint: 678,
              settings: { rows: 1, slidesPerRow: 1 },
            },
          ]}
          infinite
        >
          {datas?.map((coin, index) => (
            <div key={index}>
              <CoinCard onClick={() => handleCoinClick(coin.pair)} coin={coin} />
            </div>
          ))}
        </Carousel>
      )}

      {render === 'all' && (
        <Row gutter={[20, 24]} align="middle" className={styles.root}>
          {normalizeData(data, type)?.map((coin, index) => (
            <Col key={index} xs={24} md={12} lg={8} xl={6}>
              <CoinCard onClick={() => handleCoinClick(coin.pair)} coin={coin} />
            </Col>
          ))}
        </Row>
      )}
    </section>
  );
};
