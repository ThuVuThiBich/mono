import { FC } from 'react';
import styles from './styles.module.css';
import { Row, Col, Typography } from 'antd';
import { useTranslation } from 'next-i18next';

import AccountLeft from './AccountLeft';
import AccountRight from './AccountRight';

const AccountManagement: FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-100">
      <Row gutter={[24, 24]}>
        <Col xs={13} md={14} lg={13}>
          <Typography.Title className={styles.title} level={3}>
            Account Management
          </Typography.Title>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={24} lg={13}>
          <AccountLeft />
        </Col>
        <Col xs={24} md={24} lg={11}>
          <AccountRight />
        </Col>
      </Row>
    </div>
  );
};

export default AccountManagement;
