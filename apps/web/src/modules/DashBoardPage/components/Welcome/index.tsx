import { Col, Row, Typography } from 'antd';
import { FC } from 'react';
import AccountBalance from './AccountBalance';
import AccountStatusStepper from './AccountStatusStepper';
import OpenOrder from './OpenOrder';
import styles from './styles.module.css';
import WatchList from './WatchList';

const Welcome: FC = () => {
  return (
    <div className={styles.root}>
      <Typography.Title level={3}>Dashboard</Typography.Title>
      <Row gutter={[24, 24]}>
        <Col xl={13} lg={24}>
          <Row gutter={[0, 24]}>
            <AccountStatusStepper />
            <AccountBalance />
          </Row>
        </Col>
        <Col xl={11} lg={24}>
          <Row gutter={[24, 24]}>
            {/* <Col xs={24}>
              <InviteAndEarn />
            </Col> */}
            <Col xs={24}>
              {/* <Referrals /> */}
              <WatchList />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <OpenOrder />
        </Col>
      </Row>
    </div>
  );
};

export default Welcome;
