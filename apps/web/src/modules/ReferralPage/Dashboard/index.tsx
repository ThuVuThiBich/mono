import { Col, Row } from 'antd';
import React, { FC } from 'react';
import MainCard from './components/MainCard';
// import RewardRate from './components/RewardRate';
import StatisticSection from './components/StatisticSection';
import YourEarning from './components/YourEarning';
import YourInvitation from './components/YourInvitation';
import styles from './styles.module.less';

const Dashboard: FC = () => {
  return (
    <div className={styles.root}>
      <MainCard />
      <Row gutter={[29, 29]}>
        <Col xs={24} lg={12}>
          {/* <RewardRate /> */}
          <YourInvitation />
        </Col>
        <Col xs={24} lg={12}>
          <YourEarning />
        </Col>
      </Row>
      <StatisticSection />
    </div>
  );
};

export default Dashboard;
