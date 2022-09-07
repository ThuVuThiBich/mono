import { useAuthOrders } from '@cross/hooks';
import { Empty, message, Table } from 'antd';
import { useUser } from 'api/account';
import { getAuthToken } from 'api/auth';
import { cancelAllOrder, cancelOrder } from 'api/history';
import { TError } from 'api/types';
import { useWalletQuery } from 'api/wallet';
import { getOpenOrderColumn } from 'components/orderTable';
import { useAppSelector } from 'hooks';
import { useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';
import { useMutation } from 'react-query';
import { getPages } from 'store/ducks/history/slice';
import { WEB_SOCKET_URL } from 'utils/constant';
import styles from './OrdersHistory.module.less';

interface TOpenOrder {
  precisionsConfigs: any;
}

const OpenOrder: FC<TOpenOrder> = ({ precisionsConfigs }) => {
  const pages = useAppSelector(getPages);
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

  const dataSource = useMemo(() => {
    let orders = [...openOrdersList];
    if (pages.type !== 0) {
      orders = orders.filter((element: any) => {
        if (pages.type === 1) {
          return parseFloat(element[5]) > 0;
        } else if (pages.type === 2) {
          return parseFloat(element[5]) < 0;
        } else {
          return true;
        }
      });
    }
    return orders;
  }, [openOrdersList, pages]);

  return (
    <div>
      <div className={styles.table}>
        <Table
          dataSource={dataSource}
          rowKey="0"
          columns={columns}
          loading={loadingOpenOrders}
          size="small"
          scroll={{ x: true }}
          pagination={{
            hideOnSinglePage: true,
            pageSize: 5,
          }}
          locale={{
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You have no open orders." />,
          }}
        />
      </div>
    </div>
  );
};

export default OpenOrder;
