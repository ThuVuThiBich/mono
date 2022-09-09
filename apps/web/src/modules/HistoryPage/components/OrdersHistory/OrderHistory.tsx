import { FC, useCallback, useMemo } from 'react';
import { Empty, Table } from 'antd';
import styles from './OrdersHistory.module.less';
import { useTranslation } from 'next-i18next';
import { useOrderHistory } from 'api/history';
import { useAppDispatch, useAppSelector } from 'hooks';
import { getPages, setPages } from 'store/ducks/history/slice';
import { getOrderHistoryColumn } from 'components/orderTable';
import { Button } from '@cross/ui';
import { useUser } from 'api/account';

interface TOrderHistory {
  precisionsConfigs: any;
}

const OrderHistory: FC<TOrderHistory> = ({ precisionsConfigs }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const pages = useAppSelector(getPages);
  const { user } = useUser();

  const { data, isFetching } = useOrderHistory(pages);

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
    return getOrderHistoryColumn(t, precisionsConfigs);
  }, [t, precisionsConfigs]);

  return (
    <div>
      <div className={styles.table}>
        <Table
          dataSource={data?.orders}
          rowKey="orderId"
          columns={columns}
          pagination={{
            current: pages.page,
            hideOnSinglePage: true,
            pageSize: pages.page_size,
            total: data?.page?.countNumber,
          }}
          size="small"
          loading={isFetching}
          scroll={{ x: true }}
          locale={{
            emptyText: user ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You have no order history." />
            ) : (
              <a href="/api/auth/login?returnTo=/exchange">
                <Button type="primary" className={styles.authButton}>
                  Login To Trade
                </Button>
              </a>
            ),
          }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default OrderHistory;
