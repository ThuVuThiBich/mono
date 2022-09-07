import { CSSProperties, FC, memo, ReactNode } from 'react';
import styles from './styles.module.less';
import { Col, Row } from 'antd';
import clsx from 'clsx';

interface WhyItemProps {
  text: string;
  title: string;
  style?: CSSProperties;
  icon: ReactNode;
}

const WhyItem: FC<WhyItemProps> = ({ style, text, title, icon }) => {
  return (
    <Col xs={24} md={12} style={style}>
      <div className={clsx(styles.why, styles.whyTop)}>
        {icon}
        <p className={clsx(styles.text, styles.itemTopSpace)}>{text}</p>
        <p className={styles.title}>{title}</p>
      </div>
    </Col>
  );
};

const Why: FC = () => {
  return (
    <section className="container">
      <Row className={styles.root}>
        <Col xs={24} lg={24}>
          <h1>{'Why?'}</h1>
          <p>{'Lorem ipsum dolor sit amet consectetur, adipisicing elit.'}</p>
        </Col>
        <Col xs={24} lg={10} xl={12}>
          <img className={styles.whyImage} alt="why" src="/images/banner/moon.png" />
        </Col>
        <Col xs={24} lg={14} xl={12}>
          <Row gutter={[42, 42]}>
            <WhyItem
              title={'Fast'}
              text={'Lorem ipsum dolor sit amet consectetur, adipisicing elit.'}
              icon={<img className={styles.iconTop} alt="top-icon" src="/images/home/staking.png" />}
            />
            <WhyItem
              title={'Fast'}
              text={'Lorem ipsum dolor sit amet consectetur, adipisicing elit.'}
              icon={<img className={styles.iconTop} alt="top-icon" src="/images/home/staking.png" />}
            />
            <WhyItem
              title={'Fast'}
              text={'Lorem ipsum dolor sit amet consectetur, adipisicing elit.'}
              icon={<img className={styles.iconTop} alt="top-icon" src="/images/home/staking.png" />}
            />
            <WhyItem
              title={'Fast'}
              text={'Lorem ipsum dolor sit amet consectetur, adipisicing elit.'}
              icon={<img className={styles.iconTop} alt="top-icon" src="/images/home/staking.png" />}
            />
          </Row>
        </Col>
      </Row>
    </section>
  );
};

export default memo(Why);
