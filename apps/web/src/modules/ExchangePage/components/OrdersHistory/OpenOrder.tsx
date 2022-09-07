import { FC, useMemo } from 'react';
import styles from './OrdersHistory.module.less';
import { Empty, message, Table } from 'antd';
import { Button } from '@cross/ui';
import { cancelAllOrder, cancelOrder } from 'api/history';
import { useMutation } from 'react-query';
import { TError } from 'api/types';
import { useTranslation } from 'next-i18next';

import { useWalletQuery } from 'api/wallet';
import { getOpenOrderColumn } from 'components/orderTable';
import { useAuthOrders } from '@cross/hooks';
import { WEB_SOCKET_URL } from 'utils/constant';
import { useAppSelector } from 'hooks';
import { getAuthToken } from 'api/auth';
import { useUser } from 'api/account';

interface TOpenOrder {
  precisionsConfigs: any;
}

const OpenOrder: FC<TOpenOrder> = ({ precisionsConfigs }) => {
  const { t } = useTranslation();
  const { user } = useUser();

  const currentSubAccount = useAppSelector((state) => state.subAccount.currentSubAccount);

  const { openOrdersList, loadingOpenOrders } = useAuthOrders(user!, WEB_SOCKET_URL, currentSubAccount, getAuthToken);

  const { refetch }: any = useWalletQuery({
    enabled: false,
  });

  const handleCancelAll = () => {
    mutateCancelAllOrder({ demoFlag: 1 });
  };

  const handleCancelOrder = (orderId: string) => {
    mutateCancelOrder({ order_id: orderId, type: 2 });
  };

  const { mutate: mutateCancelAllOrder } = useMutation(cancelAllOrder, {
    onSuccess: () => {
      message.success(t('historypage.open_order_cancel_successfully'));
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });

  const { mutate: mutateCancelOrder } = useMutation(cancelOrder, {
    onSuccess: () => {
      message.success(t('historypage.open_order_cancel_successfully'));
      refetch();
    },
    onError: (error: TError) => {
      message.error(error.message);
    },
  });

  const columns = useMemo(() => {
    return getOpenOrderColumn(
      t,
      precisionsConfigs,
      (id) => handleCancelOrder(id),
      () => handleCancelAll(),
      openOrdersList.length === 0 || !openOrdersList
    );
  }, [t, precisionsConfigs, handleCancelAll, handleCancelOrder, openOrdersList]);

  return (
    <div>
      <div className={styles.table}>
        <Table
          dataSource={openOrdersList}
          rowKey="0"
          columns={columns}
          loading={user ? loadingOpenOrders : false}
          size="small"
          scroll={{ x: true }}
          pagination={{
            hideOnSinglePage: true,
            pageSize: 5,
          }}
          locale={{
            emptyText: user ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You have no open orders." />
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

export default OpenOrder;
