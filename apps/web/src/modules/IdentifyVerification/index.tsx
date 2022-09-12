import { FC, useState } from 'react';
import styles from './styles.module.css';
import { message } from 'antd';
import UploadDocument from './components/UploadDocument';
import Congratulation from './components/Congratulation';
import { createKYCUploadPromises, getPresignedUrl, verifyUser } from 'api/kyc';
import { useMutation } from 'react-query';
import { TVerifyUserRequest } from 'api/kyc/types';
import { countries } from './constant/countries';
import dynamic from 'next/dynamic';
import { Button, Steps } from '@cross/ui';
import { useTranslation } from 'next-i18next';

const { Step } = Steps;
const PersonalInfoForm = dynamic(() => import('./components/PersonalInfoForm'), { ssr: false });

const IdentifyVerification: FC = () => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const user = { sub: '' };

  // const { user } = useUser();
  const [data, setData] = useState<any>({
    firstName: '',
    lastName: '',
    prefixPhoneNumber: '+1',
    phoneNumber: '',
    birthday: '',
    address: '',
    city: '',
    prefectures: '',
    nationalityCode: '',
    countryCode: '',
    postcode: '',
    usCitizen: false,
    documentType: 0,
    identityNumber: undefined,
    front: undefined,
    back: undefined,
    selfie: undefined,
  });

  const { mutateAsync: mutateGetPresignedURL } = useMutation(getPresignedUrl);
  const { mutateAsync: mutateVerifyUser } = useMutation(verifyUser);
  const onFinish = async (tempData: any) => {
    try {
      setLoading(true);
      const payload = { ...tempData };
      // const presignedUrl = await mutateGetPresignedURL({
      //   sub: user?.sub || '',
      // });
      // await Promise.all(createKYCUploadPromises(presignedUrl, payload));

      delete payload.front;
      delete payload.back;
      delete payload.selfie;

      // Format payload
      // payload.phoneNumber = `${payload.prefixPhoneNumber} ${payload.phoneNumber}`;
      payload.section = payload.prefixPhoneNumber;
      payload.country = countries[payload.countryCode].name;
      payload.idNumber = payload.identityNumber;
      delete payload.prefixPhoneNumber;
      delete payload.identityNumber;
      delete payload.countryCode;

      // payload.nationality = countries[payload.nationalityCode].nationality;
      await mutateVerifyUser({
        ...payload,
        sub: user?.sub || '',
      } as TVerifyUserRequest);
      setCurrent(2);
    } catch (error: any) {
      message.error('Identity Failed');
    }
    setLoading(false);
  };

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>IDENTITY VERIFICATION</h1>
      <p className="primary text-18 center">Your identity will be verified manually</p>

      <Steps className={styles.stepper} labelPlacement="vertical" current={current}>
        <Step title="Personal Info" />
        <Step title="Document" />
        <Step title="Get Verified" />
      </Steps>
      {current === 0 ? (
        <PersonalInfoForm
          onSuccess={() => {
            setCurrent(1);
          }}
          kycData={[data, setData]}
        />
      ) : null}
      {current === 1 ? (
        <UploadDocument isLoading={isLoading} onSuccess={onFinish} setCurrent={setCurrent} kycData={[data, setData]} />
      ) : null}
      {current === 2 ? <Congratulation /> : null}

      {/* {current === 1 && (
        <Button className={styles.btnGoBack} onClick={() => setCurrent(0)} type="primary">
          Go back
        </Button>
      )} */}
    </div>
  );
};

export default IdentifyVerification;
