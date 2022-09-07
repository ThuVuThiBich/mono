import { FC } from 'react';
import styles from './Referrals.module.css';
import { Space, Row, Col, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { routes } from 'types/routes';
import { useTypeSafeTranslation } from 'hooks';
import { Surface } from '@cross/ui';

const Referrals: FC = () => {
  const { t } = useTypeSafeTranslation();
  const router = useRouter();

  return (
    <Surface borderMd className={styles.root}>
      <div className="f-between">
        <div className="bold default uppercase">{t('referral.other.referrals')}</div>
        <FontAwesomeIcon icon={faUsers} color="#788686" size="lg" />
      </div>

      <div className="divider-x my-8" />

      <Row className={styles.spacing} gutter={[12, 12]}>
        {/* <Col span={24}>
          <RateLevelProgress />
        </Col> */}
        <Col span={24}>
          {/* <ReferralCount theme="light" /> */}
        </Col>
      </Row>
      <div className="f-end -mr-15">
        <Button type="text" className="right" onClick={() => router.push(routes.referral)}>
          <Space>
            {t('referral.tab.dashboard_title')} <FontAwesomeIcon icon={faArrowRight} />
          </Space>
        </Button>
      </div>
    </Surface>
  );
};

export default Referrals;
