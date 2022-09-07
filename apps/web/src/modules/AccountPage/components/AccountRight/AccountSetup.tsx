import { Col, Row, Space, Tooltip } from 'antd';
import { FC, useMemo } from 'react';
import styles from './AccountSetup.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'next-i18next';
import SecureIcon from 'modules/AccountPage/assets/icon-secure.png';
import VerifiedIcon from 'modules/AccountPage/assets/icon-verified.png';
import ActiveSecure from 'modules/AccountPage/assets/active-secure.png';
import ActiveVerified from 'modules/AccountPage/assets/active-verified.png';
import UnderReview from 'modules/AccountPage/assets/under-review.png';
import Link from 'next/link';
import { routes } from 'types/routes';
import { TGetUserInfoResponse, useGetUserInfo } from 'api/account';
import { Button, Surface } from '@cross/ui';
import { useRouter } from 'next/router';

interface MFAProps {
  user?: TGetUserInfoResponse;
}

const MFA: FC<MFAProps> = ({ user }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const isActiveMFA = useMemo(() => {
    return user?.use_mfa || false;
  }, [user]);

  const handleMFA = () => {
    if (isActiveMFA) {
      router.push('/mfa/disable');
    } else {
      router.push('/mfa/enable');
    }
  };

  return (
    <Surface borderMd className={styles.root}>
      <Space direction="vertical" className="w-100">
        <Tooltip placement="topRight" title="Setup 2FA to add extra security level to your account" color={'#22242a'}>
          <FontAwesomeIcon icon={faQuestionCircle} className={styles.icon} />
        </Tooltip>
        <div className={styles.form}>
          <img alt="secure" src={isActiveMFA ? ActiveSecure.src : SecureIcon.src} />
          <h4 className="text-14 small">
            {isActiveMFA ? t('account_management.setup.MFA_enable_title') : 'Not Secure!'}
          </h4>
          <p className={styles.description}>
            {isActiveMFA
              ? t('account_management.setup.MFA_enable_description')
              : 'Setup 2-Factor to secure your account'}
          </p>
          <Button type="primary" className={styles.btn} onClick={handleMFA}>
            {isActiveMFA ? t('account_management.setup.MFA_disable_button') : 'Setup'}
          </Button>
        </div>
      </Space>
    </Surface>
  );
};

interface KYCProps {
  user?: TGetUserInfoResponse;
}

const KYC: FC<KYCProps> = ({ user }) => {
  const { t } = useTranslation();

  const get = {
    kycStatus() {
      return user?.kyc_status || 0;
    },
    kycTitle() {
      const status = this.kycStatus();
      switch (status) {
        case 1:
          return t('account_management.setup.KYC_submitted_title');
        case 2:
          return t('account_management.setup.KYC_passed_title');
        case 3:
          return t('account_management.setup.KYC_failed_title');
        default:
          return 'Not Verified';
      }
    },
    kycIcon() {
      const status = this.kycStatus();
      switch (status) {
        case 1:
          return UnderReview;
        case 2:
          return ActiveVerified;
        case 3:
          return VerifiedIcon;
        default:
          return VerifiedIcon;
      }
    },
    kycDescription() {
      const status = this.kycStatus();
      switch (status) {
        case 1:
          return t('account_management.setup.KYC_submitted_description');
        case 2:
          return t('account_management.setup.KYC_passed_description');
        case 3:
          return t('account_management.setup.KYC_failed_description');
        default:
          return 'Setup KYC to secure your account';
      }
    },
    isShowKYCButton() {
      const status = this.kycStatus();
      return status !== 1;
    },
    KYCButtonText() {
      const status = this.kycStatus();
      switch (status) {
        case 2:
          return t('account_management.setup.active_verified');
        default:
          return 'Verify';
      }
    },
  };

  return (
    <Surface borderMd className={styles.root}>
      <Space direction="vertical" className="w-100">
        <Tooltip placement="topRight" title="Setup KYC to add extra security level to your account" color={'#22242a'}>
          <FontAwesomeIcon icon={faQuestionCircle} className={styles.icon} />
        </Tooltip>
        <div className={styles.form}>
          <img alt="image" src={get.kycIcon().src} />
          <h4 className="text-14 small">{get.kycTitle()}</h4>
          <p className={styles.description}>{get.kycDescription()}</p>
          {get.isShowKYCButton() && (
            <Link href={routes.identifyVerification}>
              <a>
                <Button type="primary" className={styles.btn} disabled={get.kycStatus() === 2}>
                  {get.KYCButtonText()}
                </Button>
              </a>
            </Link>
          )}
        </div>
      </Space>
    </Surface>
  );
};

const AccountSetup: FC = () => {
  const { data } = useGetUserInfo({ refetchInterval: 10000 });

  return (
    <Row className={styles.wrapper} gutter={[48, 24]}>
      <Col xs={24} sm={12}>
        <MFA user={data} />
      </Col>
      <Col xs={24} sm={12}>
        <KYC user={data} />
      </Col>
    </Row>
  );
};

export default AccountSetup;
