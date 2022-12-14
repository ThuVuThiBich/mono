import { Button, Surface } from '@cross/ui';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row, Space, Tooltip } from 'antd';
import { TGetUserInfoResponse, useGetUserInfo } from 'api/account';
import { useAppSelector } from 'hooks';
import ActiveSecure from 'modules/AccountPage/assets/active-secure.png';
import ActiveVerified from 'modules/AccountPage/assets/active-verified.png';
import SecureIcon from 'modules/AccountPage/assets/icon-secure.png';
import VerifiedIcon from 'modules/AccountPage/assets/icon-verified.png';
import UnderReview from 'modules/AccountPage/assets/under-review.png';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { getUserAuth } from 'store/ducks/account/slice';
import { toggleMFAModal } from 'store/ducks/system/slice';
import { routes } from 'types/routes';
import styles from './AccountSetup.module.css';

interface MFAProps {
  user?: TGetUserInfoResponse;
}

const MFA: FC<MFAProps> = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const userData = useAppSelector(getUserAuth);

  const isActiveMFA = useMemo(() => {
    return userData?.['google-auth'] || false;
  }, [userData]);

  const handleMFA = () => {
    if (isActiveMFA) {
      dispatch(toggleMFAModal(true));
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
          <h4 className="text-14 small">{isActiveMFA ? 'Secure' : 'Not Secure!'}</h4>
          <p className={styles.description}>
            {isActiveMFA ? 'Google Authenticator' : 'Setup 2-Factor to secure your account'}
          </p>
          <Button type="primary" className={styles.btn} onClick={handleMFA}>
            {isActiveMFA ? 'Disable' : 'Setup'}
          </Button>
        </div>
      </Space>
    </Surface>
  );
};

interface KYCProps {
  user?: any;
}

const KYC: FC<KYCProps> = ({ user }) => {

  const get = {
    kycStatus() {
      // return user?.kyc_status || 0;
      return user?.realVerify || 0;
    },
    kycTitle() {
      const status = this.kycStatus();
      switch (status) {
        case 1:
          return 'Under Review';
        case 2:
          return 'Verified';
        case 3:
          return 'Verified Failed';
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
          return 'Your documents are being reviewed';
        case 2:
          return 'You Completed KYC';
        case 3:
          return 'Your documents were rejected';
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
          return 'Verified';
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
