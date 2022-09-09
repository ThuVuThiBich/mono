import { FC, useCallback, useMemo, useState } from 'react';
import { Empty, Table } from 'antd';
import styles from './OrdersHistory.module.less';
import { TRequestHistory, useTradeHistory } from 'api/history';
import { useTranslation } from 'next-i18next';
import { Button } from '@cross/ui';
import { getTradeHistoryColumn } from 'components/orderTable';
import { useUser } from 'api/account';
interface TradeHistoryProps {
  precisionsConfigs: any;
}
const PAGE_SIZE = 5;

const TradeHistory: FC<TradeHistoryProps> = ({ precisionsConfigs }) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [pages, setPages] = useState<TRequestHistory>({
    symbol: '',
    type: 0,
    state: '',
    start_time: 0,
    end_time: 0,
    order_id: '',
    page: 1,
    page_size: PAGE_SIZE,
    sort: '',
    columnSort: '',
  });

  const { data, isFetching } = useTradeHistory(pages);

  const handleTableChange = useCallback((pagination, filters, sorter) => {
    const order = sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : '';

    setPages((old) => ({
      ...old,
      page: pagination.current,
      columnSort: order ? sorter.columnKey : '',
      sort: order,
    }));
  }, []);

  const columns = useMemo(() => {
    return getTradeHistoryColumn(t, precisionsConfigs);
  }, [t, precisionsConfigs]);

  return (
    <div>
      <div className={styles.table}>
        <Table
          dataSource={data?.orders}
          rowKey="tradeId"
          columns={columns}
          scroll={{ x: true }}
          size="small"
          loading={isFetching}
          onChange={handleTableChange}
          pagination={{
            hideOnSinglePage: true,
            pageSize: pages.page_size,
            total: data?.page?.countNumber,
          }}
          locale={{
            emptyText: user ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='You have no trade history.' />
            ) : (
              <a href="/api/auth/login?returnTo=/exchange">
                <Button type="primary" className={styles.authButton}>
                  {'Login'}
                </Button>
              </a>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default TradeHistory;
