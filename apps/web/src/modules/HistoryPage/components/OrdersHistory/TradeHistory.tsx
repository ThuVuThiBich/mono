import { FC, useCallback, useMemo } from 'react';
import { Empty, Table } from 'antd';
import styles from './OrdersHistory.module.less';
import { useTradeHistory } from 'api/history';
import { useTranslation } from 'next-i18next';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getPages, setPages } from 'store/ducks/history/slice';
import { getTradeHistoryColumn } from 'components/orderTable';
import { Button } from '@cross/ui';
interface TradeHistoryProps {
  precisionsConfigs: any;
}

const TradeHistory: FC<TradeHistoryProps> = ({ precisionsConfigs }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  // const { user } = useUser();
  const user = true;

  const pages = useAppSelector(getPages);

  const { data, isFetching } = useTradeHistory(pages);

  const handleTableChange = useCallback(
    (pagination, filters, sorter) => {
      const order = sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : '';

      dispatch(
        setPages({
          ...pages,
          start_time: pages.start_time ? pages.start_time.valueOf() : 0,
          end_time: pages.end_time ? pages.end_time.valueOf() : 0,
          page: pagination.current,
          columnSort: order ? sorter.columnKey : '',
          sort: order,
        })
      );
    },
    [pages]
  );

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
            current: pages.page,
            hideOnSinglePage: true,
            pageSize: pages.page_size,
            total: data?.page?.countNumber,
          }}
          locale={{
            emptyText: user ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You have no trade." />
            ) : (
              <a href="/api/auth/login?returnTo=/exchange">
                <Button type="primary" className={styles.authButton}>
                  Login To Trade
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
