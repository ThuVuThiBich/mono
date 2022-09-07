import { Table } from 'antd';
import { FC, memo, useMemo } from 'react';
import { Surface } from '@cross/ui';
import styles from './OrderBookTable.module.css';
import { ColumnsType } from 'antd/lib/table';
import AskTable from './Table/Ask';
import BidTable from './Table/Bid';
import LastPrice from './Table/LastPrice';

const OrderBookTable: FC = () => {

  const columns = useMemo(() => {
    return [
      {
        title: 'Price',
        key: 'price',
        dataIndex: 'price',
        align: 'left',
      },
      {
        title: 'Amount',
        key: 'amount',
        dataIndex: 'amount',
        align: 'right',
      },
      {
        title: 'Total',
        key: 'total',
        dataIndex: 'total',
        align: 'right',
      },
    ] as ColumnsType<any>;
  }, []);

  return (
    <Surface className={styles.root} borderLess>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <Table dataSource={[]} columns={columns} size="small" />
        </div>
        <AskTable />
        <LastPrice />
        <BidTable />
      </div>
    </Surface>
  );
};

export default memo(OrderBookTable);
