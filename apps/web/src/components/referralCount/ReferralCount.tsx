import React, { FC, memo, useMemo } from 'react';
import styles from './ReferralCount.module.less';

import { Avatar } from '@cross/ui';
import { Col, Row, Space, Tooltip } from 'antd';
import { useReferralCount } from 'api/dashboard';
import clsx from 'clsx';
import { useTypeSafeTranslation } from 'hooks';

interface ReferralCountProps {
  className?: string;
  theme?: 'light' | 'dark';
}

const ReferralCount: FC<ReferralCountProps> = ({ className, theme = 'dark' }) => {
  const { t } = useTypeSafeTranslation();
  const { data: referralCount } = useReferralCount();

  const total = useMemo(() => {
    if (!referralCount) return 0;
    return (
      parseInt(referralCount.kyc_count) +
      parseInt(referralCount.registration_only_count) +
      parseInt(referralCount.qualified_count)
    );
  }, [referralCount]);

  return (
    <Row className={className} gutter={[25, 12]}>
      <Col xs={24} lg={8}>
        <div className={clsx(styles[theme], styles.cardStatictis)}>
          <div className="bold text-45 primary">{total}</div>
          <div className="white center">Referrals</div>
        </div>
      </Col>
      <Col xs={24} lg={16}>
        <div className={clsx(styles[theme], styles.cardStatictis, 'f-center')}>
          <Space size={32} split={<div className="divider-y" />}>
            <Tooltip title={<span className="blue">{t('referral.status.REGISTRATION_ONLY')}</span>}>
              <Space className={styles.statictisItem}>
                <Avatar size={25} src="/images/svgs/pending.svg" />
                <span className={styles.clock}>{referralCount?.registration_only_count || 0}</span>
              </Space>
            </Tooltip>

            <Tooltip title={<span className={styles.check}>{t('referral.status.KYC_COMPLETED')}</span>}>
              <Space className={styles.statictisItem}>
                <Avatar size={25} src="/images/svgs/check-green.svg" />
                <span className={styles.check}>{referralCount?.kyc_count || 0}</span>
              </Space>
            </Tooltip>

            <Tooltip title={<span>{t('referral.status.TRADE_OR_MINED')}</span>}>
              <Space className={styles.statictisItem}>
                <Avatar size={25} src="/images/svgs/bull-circle.svg" />
                <span className={styles.bull}>{referralCount?.qualified_count || 0}</span>
              </Space>
            </Tooltip>
          </Space>
        </div>
      </Col>
    </Row>
  );
};

export default memo(ReferralCount);
