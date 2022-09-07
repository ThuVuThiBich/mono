import React, { Dispatch, FC, SetStateAction, useMemo } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import { useAppSelector } from 'hooks';
import { Responsive, WidthProvider } from 'react-grid-layout';
import OrdersHistory from '../components/OrdersHistory';
import TradingChart from '../components/TradingChart';
import Wallet from '../components/Wallet';
import { marginLayout, spotLayout } from './Layout';
import { getPairType } from 'store/ducks/exchange/slice';
import { OrderBook, TradesBoard } from '../components/TradeBoard';
import PlaceOrder from '../components/PlaceOrder';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface Props {}

const DesktopRenderer: FC<Props> = () => {
  const pairType = useAppSelector(getPairType);
  const { market, chart, trades, orderBook, openOrders, walletSnap, fullscreen } = useAppSelector(
    (state) => state.system.exchange
  );

  const filterLayout = (res: any, key: string) => {
    res.xl = res.xl.filter((x: any) => x.i !== key);
    res.lg = res.lg.filter((x: any) => x.i !== key);
    res.md = res.md.filter((x: any) => x.i !== key);
    res.sm = res.sm.filter((x: any) => x.i !== key);
  };

  const layout = useMemo(() => {
    let res = pairType === 'margin' ? marginLayout : spotLayout;

    if (!orderBook) filterLayout(res, 'a');
    if (!trades) filterLayout(res, 'f');
    if (!chart) filterLayout(res, 'b');
    if (!market) filterLayout(res, 'c');
    if (!openOrders) filterLayout(res, 'd');
    if (!walletSnap) filterLayout(res, 'e');

    return res;
  }, [orderBook, trades, chart, market, openOrders, walletSnap, pairType]);

  return (
    <div className={clsx(styles.root, 'container-fluid')}>
      {fullscreen && chart && <TradingChart />}
      <ResponsiveGridLayout
        className="layout"
        layouts={layout}
        draggableHandle=".draggable"
        breakpoints={{ xl: 1200, lg: 992, md: 768, sm: 576 }}
        cols={{ xl: 24, lg: 12, md: 12, sm: 12 }}
        rowHeight={40}
      >
        <div className={clsx({ [styles.hide]: !orderBook })} key="a">
          {orderBook && <OrderBook />}
        </div>

        <div style={{ zIndex: 2 }} className={clsx({ [styles.hide]: !chart })} key="b">
          {chart && <TradingChart />}
        </div>
        <div className={clsx({ [styles.hide]: !market })} key="c">
          {market && <PlaceOrder />}
        </div>
        <div className={clsx({ [styles.hide]: !openOrders })} key="d">
          {openOrders && <OrdersHistory />}
        </div>
        <div className={clsx({ [styles.hide]: !walletSnap })} key="e">
          {walletSnap && <Wallet />}
        </div>
        <div className={clsx({ [styles.hide]: !trades })} key="f">
          <TradesBoard />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default DesktopRenderer;
