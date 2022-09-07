import { FC } from 'react';
import styles from './styles.module.less';
import CardSection from './components/CardSection';
import TableSection from './components/TableSection';
import EarnModal from './components/EarnModal';
import EarnInfoSection from 'components/earnAndStake/EarnInfoSection';
import clsx from 'clsx';
import { useUser } from 'api/account';

const UltEarnPage: FC = () => {
  const { user } = useUser();

  return (
    <div className={clsx(styles.root, 'container')}>
      <CardSection />
      {user && <EarnInfoSection />}
      <TableSection />
      <EarnModal />
    </div>
  );
};

export default UltEarnPage;
