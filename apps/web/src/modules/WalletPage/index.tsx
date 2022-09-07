import { FC } from 'react';
import styles from './styles.module.less';
import Header from './components/Header';

import WalletTable from './components/WalletTable';
import { MainLayout } from 'components/mainLayout';

const WalletPage: FC = () => {
  return (
    <MainLayout className={styles.walletPage} fluid>
      <Header />
      <WalletTable />
    </MainLayout>
  );
};

export default WalletPage;
