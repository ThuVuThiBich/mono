import { MainLayout } from 'components/mainLayout';
import { useRouter } from 'next/router';
import { FC, useCallback } from 'react';
import styles from './styles.module.less';
import { Space } from 'antd';
import { FilterGroup } from '@cross/ui';
import OrdersHistory from './components/OrdersHistory';
import WalletHistory from './components/WalletHistory';

type TTableType = 'orders' | 'assets';

const HistoryPage: FC = () => {
  const router = useRouter();

  const { tab } = router.query as { tab: TTableType };

  const handleTabChange = useCallback((e) => {
    router.replace(`${router.pathname}?tab=${e.target.value}`, undefined, {
      shallow: true,
    });
  }, []);
  return (
    <MainLayout>
      <h1 className={styles.heading}>History</h1>
      <Space size={20}>
        <FilterGroup
          datas={[
            { label: 'Orders', value: 'orders' },
            { label: 'Assets', value: 'assets' },
          ]}
          value={tab || 'orders'}
          onChange={handleTabChange}
        />
      </Space>
      {(!tab || tab === 'orders') && <OrdersHistory />}
      {tab === 'assets' && <WalletHistory />}
    </MainLayout>
  );
};

export default HistoryPage;
