import React, { FC } from 'react';
import styles from './styles.module.less';
import { Col, Row } from 'antd';
import clsx from 'clsx';
import { UserInfoSelection } from 'components/userSelection';

interface MainLayoutProps {
  fluid?: boolean;
  className?: string;
}

const MainLayout: FC<MainLayoutProps> = ({ children, fluid, className }) => {
  return (
    <div className={clsx(styles.root, 'container-fluid', className)}>
      <Row justify="center">
        <Col xs={24} xxl={24}>
          <Row gutter={[24, 24]} justify="space-around">
            <Col xs={0} lg={6}>
              <UserInfoSelection />
            </Col>
            <Col xs={24} lg={18}>
              {children}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default MainLayout;
