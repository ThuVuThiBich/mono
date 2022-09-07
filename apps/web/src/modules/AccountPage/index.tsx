import { MainLayout } from 'components/mainLayout';
import { FC } from 'react';
import AccountManagement from './components';
import styles from './styles.module.less';

const AccountPage: FC = () => {
  return (
    <MainLayout>
      <AccountManagement/>
    </MainLayout>
  );
};

export default AccountPage;
