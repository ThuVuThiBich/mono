import { FC } from 'react';
import styles from './styles.module.less';
// import { Col, Row } from 'antd';
import { StakeInfoSection } from 'components/earnAndStake';
import CardSection from './components/CardSection';
import TableSection from './components/TableSection';
import clsx from 'clsx';
import StakeModal from './components/StakeModal';
import { useUser } from 'api/account';

const StakePage: FC = () => {
  const { user } = useUser();
  return (
    <div className={clsx(styles.root, 'container')}>
      <div>
        <div>
          <CardSection />
          {user && <StakeInfoSection />}
          <TableSection />
          <StakeModal />
        </div>
      </div>
    </div>
  );
};

export default StakePage;
