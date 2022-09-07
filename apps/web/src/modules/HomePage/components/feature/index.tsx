import { CSSProperties, FC, memo, ReactNode } from 'react';
import styles from './styles.module.less';
import { Col, Row } from 'antd';
import clsx from 'clsx';

interface FeatureItemProps {
  text: string;
  title: string;
  style?: CSSProperties;
  icon: ReactNode;
}

export const FeatureItem: FC<FeatureItemProps> = ({ style, text, title, icon }) => {
  return (
    <Col md={8} lg={4} style={style}>
      <div className={clsx(styles.why, styles.whyBottom)}>
        {icon}
        <p className={clsx(styles.title, styles.itemBottomSpace)}>{title}</p>
        <p className={styles.text}>{text}</p>
      </div>
    </Col>
  );
};

const Feature: FC = () => {
  return (
    <div className="container">
      <Row justify="space-around" gutter={[24, 16]} className={styles.root}>
        <FeatureItem
          title={'Spot'}
          text={'Lorem ipsum dolor sit amet consectetur, adipisicing elit.'}
          icon={<img className={styles.iconBottom} alt="spot" src="/images/home/spot.png" />}
        />

        <FeatureItem
          title={'Staking'}
          text={'Lorem ipsum dolor sit amet consectetur, adipisicing elit.'}
          icon={<img className={styles.iconBottom} alt="staking" src="/images/home/staking.png" />}
        />
        <FeatureItem
          title={'Devices'}
          text={'Lorem ipsum dolor sit amet consectetur, adipisicing elit.'}
          icon={<img className={styles.iconBottom} alt="mobile_app" src="/images/home/mobile_app.png" />}
        />
        <FeatureItem
          title={'Pro Tools'}
          text={'Lorem ipsum dolor sit amet consectetur, adipisicing elit.'}
          icon={<img className={styles.iconBottom} alt="pro-tool" src="/images/home/pro_tool.png" />}
        />
      </Row>
    </div>
  );
};

export default memo(Feature);
