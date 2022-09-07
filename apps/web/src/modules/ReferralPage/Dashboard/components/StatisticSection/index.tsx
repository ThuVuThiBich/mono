import { Col, Row } from 'antd';
import React, { FC } from 'react';
import LevelUpgrade from './LevelUpgrade';
// import ProgramDetail from './ProgramDetail';
import RewardTable from './RewardTable';
import styles from './styles.module.less';
import { useTypeSafeTranslation } from 'hooks';

const StatisticSection: FC = () => {
  const { t } = useTypeSafeTranslation();

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span>invite more</span>
        <h1>TO EARN MORE</h1>
        <p>Your reward level increase as your invitees generate more fee!</p>
      </div>

      <Row gutter={[31, 31]}>
        <Col xs={24} lg={12}>
          <RewardTable />
        </Col>
        <Col xs={24} lg={12}>
          <LevelUpgrade />
        </Col>
      </Row>

      {/* <ProgramDetail /> */}
    </div>
  );
};

export default StatisticSection;
