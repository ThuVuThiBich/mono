/* eslint-disable react/display-name */
import { Surface, TabPane, Tabs } from '@cross/ui';
import { faDotCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePairListQuery } from 'api/exchange';
import { useAppDispatch } from 'hooks';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { setExchange } from 'store/ducks/system/slice';
import OpenOrder from './OpenOrder';
import OrderHistory from './OrderHistory';
import styles from './OrdersHistory.module.less';
import TradeHistory from './TradeHistory';

type THistoryType = 'openOrders' | 'orderHistory' | 'tradeHistory';

interface OrdersHistoryProps {}

const OrdersHistory: FC<OrdersHistoryProps> = memo(() => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [precisionsConfigs, setPrecisionsConfigs] = useState<any>({});
  const [historyType, setHistoryType] = useState<THistoryType>('openOrders');
  const { data: pairList } = usePairListQuery({
    leverage: 'ALL',
  });
  const router = useRouter();

  const changeFilter = useCallback((e: THistoryType) => {
    setHistoryType(e);
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

  const labels = useMemo(() => {
    const defaultLabel = [
      { label: 'Open Orders', value: 'openOrders' },
      { label: 'Order History', value: 'orderHistory' },
      { label: 'Trade History', value: 'tradeHistory' },
    ];

    return defaultLabel;
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.iconClose}>
        <FontAwesomeIcon
          onClick={() => dispatch(setExchange({ name: 'openOrders', value: false }))}
          color="#788686"
          icon={faTimesCircle}
        />
        <FontAwesomeIcon color="#9AA3A7" className="drag-icon draggable" icon={faDotCircle} />
      </div>

      <div>
        <Surface borderMd filled className={styles.root}>
          <div className={styles.tabWrapper}>
            <Tabs>
              {labels?.map((item) => (
                <TabPane
                  onClick={() => changeFilter(item.value as THistoryType)}
                  key={item.value}
                  active={historyType === item.value}
                >
                  {item.label}
                </TabPane>
              ))}
            </Tabs>
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
    </div>
  );
});

export default OrdersHistory;
