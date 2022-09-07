import React from 'react';
import styles from './Congratulation.module.css';
import { Result } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import CheckIcon from '../assets/img/CheckIcon.png';

import { routes } from 'types/routes';
import Link from 'next/link';
import { useTypeSafeTranslation } from 'hooks';
import { Trans } from 'next-i18next';
import { Button, Surface } from '@cross/ui';

const Congratulation: React.FC = () => {
  const { t } = useTypeSafeTranslation();

  return (
    <Surface className={styles.surface}>
      <Result
        status="success"
        icon={<img className={styles.icon} alt="check" src={CheckIcon.src} />}
        title={<span className={styles.title}>{t('kyc.subscription_success')}</span>}
        subTitle={
          <p className={styles.description}>
            <Trans i18nKey="kyc.subscription_success_desc" />
          </p>
        }
        extra={[
          <Button type="secondary" key="dashboard">
            <Link href={routes.accountManagement}>
              <a>
                {t('kyc.to_dashboard')} <ArrowRightOutlined />
              </a>
            </Link>
          </Button>,
        ]}
      />
    </Surface>
  );
};

export default Congratulation;
