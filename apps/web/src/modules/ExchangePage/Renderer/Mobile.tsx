import { Col, Row } from 'antd';
import clsx from 'clsx';
import { useAppSelector } from 'hooks';
import { FC } from 'react';
import OrdersHistory from '../components/OrdersHistory';
import PlaceOrder from '../components/PlaceOrder';
import { Board } from '../components/TradeBoard';
import TradingChart from '../components/TradingChart';
import Wallet from '../components/Wallet';
import styles from './styles.module.css';

interface Props {}

const MobileRenderer: FC<Props> = () => {
  const { market, chart, board, openOrders, walletSnap } = useAppSelector((state) => state.system.exchange);

  return (
    <div className={clsx(styles.root, 'container-fluid')}>
      <Row gutter={[24, 24]} align="top">
        {chart && (
          <Col span={24} className={styles.tradingChartCol}>
            <TradingChart />
          </Col>
        )}

        {board && (
          <Col span={24}>
            <Board />
          </Col>
        )}

        {market && (
          <Col span={24}>
            <PlaceOrder />
          </Col>
        )}

        {walletSnap && (
          <Col xs={24}>
            <Wallet />
          </Col>
        )}

        {openOrders && (
          <Col span={24}>
            <OrdersHistory />
          </Col>
        )}
      </Row>
    </div>
  );
};

export default MobileRenderer;
