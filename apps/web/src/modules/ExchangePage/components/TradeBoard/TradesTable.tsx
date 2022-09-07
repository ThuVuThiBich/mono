import { useTrades } from '@cross/hooks';
import { Surface } from '@cross/ui';
import { Empty, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector, useTypeSafeTranslation } from 'hooks';
import moment from 'moment';
import { useRouter } from 'next/router';
import { FC, useEffect, useMemo, useState } from 'react';
import { getCurrentPairValue, setOrderBookSelect } from 'store/ducks/exchange/slice';
import { nDecimalFormat } from 'utils/number';
import styles from './TradesTable.module.less';

interface TradeTableData {
  id: number;
  price: string;
  amount: string;
  time: string;
  increment: string;
}

export const TradesTable: FC = () => {
  const { t } = useTypeSafeTranslation();
  const [headerDatatables] = useState<any[]>([]);
  const [datatables, setDatatables] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const renderRowClassName = (record: any) => {
    return record.increment == 'true' ? styles.rowBuy : styles.rowSell;
  };

  const currentPair = useRouter().query.id as string;

  const { tradesData, loadingTradesData } = useTrades(currentPair);

  const currentPairValue = useAppSelector(getCurrentPairValue);

  useEffect(() => {
    let history = tradesData.history;

    let dataHistory: TradeTableData[] = [];

    history.forEach((item: any, index: number) => {
      dataHistory.push({
        id: index,
        price: nDecimalFormat('' + item[1], currentPairValue?.[3] ?? 2),
        amount: nDecimalFormat('' + item[2], currentPairValue?.[2] ?? 2),
        time: moment(parseInt(item[3])).format('HH:mm:ss'),
        increment: item[4],
      });
    });
    setLoading(false);

    setDatatables(dataHistory);
  }, [currentPairValue, tradesData]);

  useEffect(() => {
    if (tradesData.history.length === 0) setLoading(true);
  }, [tradesData.history.length]);

  const columns = useMemo(() => {
    return [
      {
        title: 'Price',
        key: 'price',
        dataIndex: 'price',
        align: 'left',
        render: (val, record) => <span id={`trades-prices-${record.id}`}>{val}</span>,
      },
      {
        title: 'Amount',
        key: 'amount',
        dataIndex: 'amount',
        align: 'right',
        render: (text: any) => {
          return text;
        },
      },
      {
        title: 'Time',
        key: 'time',
        dataIndex: 'time',
        align: 'right',
        render: (text: any) => {
          return text;
        },
      },
    ] as ColumnsType<TradeTableData>;
  }, []);

  useEffect(() => {
    if (tradesData.history.length === 0) setLoading(true);
  }, [tradesData.history.length]);

  return (
    <Surface className={styles.root} borderLess>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <Table dataSource={headerDatatables} columns={columns} size="small" />
        </div>
        <div className={clsx(styles.tableTrades, 'scroll')}>
          <Table
            dataSource={datatables}
            rowKey="id"
            columns={columns}
            pagination={false}
            size="small"
            showHeader={false}
            loading={loading || loadingTradesData}
            rowClassName={(record: TradeTableData) => renderRowClassName(record)}
            onRow={(record: TradeTableData) => {
              return {
                onClick: () => {
                  let price = parseFloat(record.price.replace(/,/g, ''));
                  let amount = parseFloat(record.amount.replace(/,/g, ''));
                  let type = record.increment === 'true' ? 'asks' : 'bids';
                  dispatch(setOrderBookSelect({ type, price, amount }));
                },
              };
            }}
            locale={{
              emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'No Data'} />,
            }}
          />
        </div>
      </div>
    </Surface>
  );
};
