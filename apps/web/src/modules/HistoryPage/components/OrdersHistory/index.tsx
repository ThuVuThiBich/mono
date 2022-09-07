import { FilterGroup, Surface } from '@cross/ui';
import { Avatar } from 'antd';
import { usePairListQuery } from 'api/exchange';
import { FC, memo, useCallback, useEffect, useState } from 'react';
import Filter from './Filter';
import OpenOrder from './OpenOrder';
import OrderHistory from './OrderHistory';
import styles from './OrdersHistory.module.less';
import TradeHistory from './TradeHistory';

type THistoryType = 'openOrders' | 'orderHistory' | 'tradeHistory';

const OrdersHistory: FC = () => {
  const [precisionsConfigs, setPrecisionsConfigs] = useState<any>({});
  const [historyType, setHistoryType] = useState<THistoryType>('openOrders');
  const { data: pairList } = usePairListQuery({
    leverage: 'ALL',
  });

  const changeFilter = useCallback((e: any) => {
    setHistoryType(e.target.value);
  }, []);

  useEffect(() => {
    let precisions: any = {};
    if (pairList) {
      pairList.forEach((data: any) => {
        precisions[data[0]] = {
          coin: parseInt(data[2]),
          money: parseInt(data[3]),
        };
      });
      setPrecisionsConfigs(precisions);
    }
  }, [pairList]);

  return (
    <div className={styles.mainContainer}>
      <Filter historyType={historyType} />

      <Surface filled className={styles.root}>
        <div className={styles.header}>
          <div className={styles.title}>
            {historyType === 'openOrders'
              ? 'Open Orders'
              : historyType === 'orderHistory'
              ? 'Order History'
              : 'Trade History'}
          </div>

          <div className={styles.tabWrapper}>
            <FilterGroup
              datas={[
                {
                  label: 'Open Orders',
                  value: 'openOrders',
                },
                {
                  label: 'Order History',
                  value: 'orderHistory',
                },
                {
                  label: 'Trade History',
                  value: 'tradeHistory',
                },
              ]}
              value={historyType}
              filled
              onChange={changeFilter}
              className={styles.tabSelector}
            />
            {/* <Avatar size={25} src="/images/convert.png" className={styles.iconConvert} /> */}
          </div>
        </div>
        <div className="divider-x my-8" />
        {historyType === 'openOrders' ? (
          <OpenOrder precisionsConfigs={precisionsConfigs} />
        ) : historyType === 'orderHistory' ? (
          <OrderHistory precisionsConfigs={precisionsConfigs} />
        ) : (
          <TradeHistory precisionsConfigs={precisionsConfigs} />
        )}
      </Surface>
    </div>
  );
};

export default memo(OrdersHistory);
