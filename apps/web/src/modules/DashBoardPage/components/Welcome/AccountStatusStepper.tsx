import { FC, useMemo } from 'react';
import styles from './AccountStatusStepper.module.css';
import { Space, Spin } from 'antd';

import { useGetUserInfo, useOnboardInfo } from 'api/account';
import { useTypeSafeTranslation } from 'hooks';
import Link from 'next/link';

import { routes } from 'types/routes';
import { Button, Steps, Surface } from '@cross/ui';
import { useRouter } from 'next/router';

const { Step } = Steps;

const SetupTwoFactor: FC = () => {
  const router = useRouter();
  const { t } = useTypeSafeTranslation();
  const { data } = useGetUserInfo();

  const isActiveMFA = useMemo(() => {
    return data?.use_mfa || false;
  }, [data]);

  const setupSecure = () => {
    if (isActiveMFA) {
      router.push('/mfa/disable');
    } else {
      router.push('/mfa/enable');
    }
  };

  return (
    <div className={styles.descriptionWrapper}>
      <p>Setup 2-Factor to secure your account</p>
      <Button className={styles.btnGo} type="primary" onClick={() => setupSecure()}>
        Go
      </Button>
    </div>
  );
};

const SetupKYCFactor: FC = () => {
  const { t } = useTypeSafeTranslation();
  const { data } = useGetUserInfo();

  const get = useMemo(() => {
    return {
      kycStatus() {
        return data?.kyc_status || 0;
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
            return t('account_management.setup.KYC_not_verified_title');
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
            return t('account_management.setup.KYC_not_verified_description');
        }
      },
    };
  }, [data]);

  return (
    <div className={styles.descriptionWrapper}>
      <p>{get.kycDescription()}</p>
      <Link href={routes.identifyVerification} passHref>
        <Button className={styles.btnGo} type="primary">
          Go
        </Button>
      </Link>
    </div>
  );
};

const AccountStatusStepper: FC = () => {
  const { t } = useTypeSafeTranslation();
  const { data, isLoading } = useGetUserInfo();
  const { data: onBoardInfo } = useOnboardInfo();

  const current = useMemo(() => {
    if (!data?.use_mfa) return 1;
    if (data.kyc_status !== 2) return 2;
    if (onBoardInfo?.depositCompletedFlg !== 1) return 3;
    return 0;
  }, [data, onBoardInfo]);

  const isFinishAll = useMemo(() => {
    return data?.use_mfa && data.kyc_status === 2 && onBoardInfo?.depositCompletedFlg === 1;
  }, [data, onBoardInfo]);

  if (isFinishAll) return null;
  return (
    <div className={styles.w100}>
      <Spin spinning={isLoading}>
        <Surface borderMd className={styles.root}>
          <Space direction="vertical" size={0}>
            <p className={styles.description}>You are a few steps away from starting your crypto investments!</p>
          </Space>
          <Steps className={styles.stepper} labelPlacement="vertical" current={current}>
            <Step title="Register" />
            <Step title="Secure" description={current === 1 && <SetupTwoFactor />} />
            <Step title="Verify" description={current === 2 && <SetupKYCFactor />} />
            <Step title="Deposit" />
          </Steps>
        </Surface>
      </Spin>
    </div>
  );
};

export default AccountStatusStepper;
