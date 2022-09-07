import { Col, Row } from 'antd';
import styles from './styles.module.less';

const Banner = () => {
  return (
    <div className={styles.container}>
      <Row align="middle" justify="center">
        <Col md={12} xs={24}>
          <img src="/images/banner/moon.png" alt="banner" className={styles.leftImg} />
        </Col>
        <Col md={12} xs={24}>
          <div className={styles.rightContent}>
            <h1 className='text-45'>Banner</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor recusandae assumenda reiciendis fugit
              placeat hic magni quas quaerat aperiam consequatur enim eaque doloremque aspernatur, optio atque, culpa
              blanditiis sequi ducimus?
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Banner;
