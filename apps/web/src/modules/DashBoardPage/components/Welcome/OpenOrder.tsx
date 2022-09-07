import { useAuthOrders } from '@cross/hooks';
import { Button, FilterGroup, Surface } from '@cross/ui';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button as ButtonAntd, Empty, message, Space, Table } from 'antd';
import { useUser } from 'api/account';
import { getAuthToken } from 'api/auth';
import { usePairListQuery } from 'api/exchange';
import { cancelAllOrder, cancelOrder } from 'api/history';
import { TError } from 'api/types';
import { useWalletQuery } from 'api/wallet';
import { getOpenOrderColumn } from 'components/orderTable';
import { useAppSelector, useTypeSafeTranslation } from 'hooks';
import { useRouter } from 'next/router';
import { FC, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { routes } from 'types/routes';
import { WEB_SOCKET_URL } from 'utils/constant';
import styles from './OpenOrder.module.css';

type IFilterType = 'all' | 'spot' | 'margin';

const OpenOrder: FC = () => {
  const { t } = useTypeSafeTranslation();
  const router = useRouter();
  const [filterType, setFilterType] = useState<IFilterType>('all');
  const { user } = useUser();
  const currentSubAccount = useAppSelector((state) => state.subAccount.currentSubAccount);

  const { loadingOpenOrders, openOrdersList } = useAuthOrders(user!, WEB_SOCKET_URL, currentSubAccount, getAuthToken);

  const { refetch }: any = useWalletQuery({
    enabled: false,
  });

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

  const handleCancelAll = () => {
    mutateCancelAllOrder({ demoFlag: 1 });
  };

  const handleCancelOrder = (orderId: string) => {
    mutateCancelOrder({ order_id: orderId, type: 2 });
  };

  const { data: pairList } = usePairListQuery({
    leverage: 'ALL',
  });

  const precisionsConfigs = useMemo(() => {
    let precisions: any = {};
    if (pairList) {
      pairList.forEach((data: any) => {
        precisions[data[0]] = {
          coin: parseInt(data[2]),
          money: parseInt(data[3]),
        };
      });
    }
    return precisions;
  }, [pairList]);

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
    <Surface filled className={styles.root}>
      <div className="f-between">
        <div className="bold default uppercase">OPEN ORDERS</div>
        <Space align="center">
          <FilterGroup
            datas={[
              { label: 'All', value: 'all' },
              // { label: 'Spot', value: 'spot' },
              // { label: 'Margin', value: 'margin' },
            ]}
            value={filterType}
            filled
            onChange={(e) => {
              setFilterType(e.target.value);
            }}
          />
          {/* <Avatar type="secondary" size={25} src="/images/convert.png" className={styles.iconConvert} /> */}
        </Space>
      </div>
      <div className="divider-x my-8" />

      <div className={styles.table}>
        <Table
          dataSource={openOrdersList}
          rowKey="0"
          columns={columns}
          loading={user ? loadingOpenOrders : false}
          size="small"
          scroll={{ x: true }}
          pagination={{
            pageSize: 10,
            hideOnSinglePage: true,
          }}
          locale={{
            emptyText: user ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You have no open orders." />
            ) : (
              <a href="/api/auth/login">
                <Button type="primary" className={styles.authButton}>
                  Login To Trade
                </Button>
              </a>
            ),
          }}
        />
      </div>

      <div className="f-end ">
        <ButtonAntd size="middle" type="text" className="right" onClick={() => router.push(routes.history)}>
          <Space>
            See All <FontAwesomeIcon icon={faArrowRight} />
          </Space>
        </ButtonAntd>
      </div>
    </Surface>
  );
};

export default OpenOrder;
