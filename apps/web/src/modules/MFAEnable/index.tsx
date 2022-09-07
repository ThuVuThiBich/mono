import { Button, Steps } from '@cross/ui';
import { useAppDispatch } from 'hooks';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useState } from 'react';
import { setAuthModal } from 'store/ducks/system/slice';
import AddKey from './components/AddKey';
import DownloadApp from './components/DownloadApp';
import Enable from './components/Enable';
import SaveKey from './components/SaveKey';
import styles from './styles.module.less';
import { LeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Space, message } from 'antd';
import { useMutation } from 'react-query';
import { TError } from 'api/types';
import { enable, getQR, getSecretKey } from 'api/gg_auth';
import { useRouter } from 'next/router';
import { routes } from 'types/routes';

const { Step } = Steps;

const MFAEnable: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [secretKey, setSecretKey] = useState<string>('');
  const [secretUrl, setSecretUrl] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const { mutateAsync: mutateGetSecretKey } = useMutation(getSecretKey, {
    onSuccess: (data) => {
      setSecretKey(data.secret);
      setSecretUrl(data.secretUrl);
    },
    onError(error: any) {
      message.error(error.msg_code as any);
    },
  });

  const { mutateAsync: mutateGetQR } = useMutation(getQR, {
    onSuccess: (data) => {
      setSecretKey(data.secret);
      setSecretUrl(data.secretUrl);
    },
    onError(error: any) {
      // message.error(error.msg_code as any);
    },
  });

  const { mutateAsync: mutateEnable } = useMutation(enable, {
    onSuccess: (data) => {
      router.push(routes.accountManagement);
    },
    onError(error: any) {
      message.error(error.msg_code as any);
      setError(true);
    },
  });

  useEffect(() => {
    dispatch(setAuthModal(null));
  }, [dispatch]);

  useEffect(() => {
    mutateGetSecretKey();
  }, [dispatch, mutateGetSecretKey]);

  useEffect(() => {
    secretUrl && mutateGetQR({ url: secretUrl });
  }, [dispatch, mutateGetQR, secretUrl]);

  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const handleEnable = (code: string) => {
    mutateEnable({ googleCode: code });
  };

  return (
    <div className={styles.root}>
      <h1 className="f-center">SECURE YOUR ACCOUNT</h1>
      <p className="primary text-18 center">Setup 2-Factor-Authentication to maximise security</p>

      <Space className={current !== 0 ? styles.action : 'f-end'}>
        {current !== 0 && (
          <Space>
            <span className={styles.btnBack} onClick={() => setCurrent(current - 1)}>
              <LeftOutlined />
              Back
            </span>
          </Space>
        )}
        <Space>
          <span className={styles.btnHowTo}>
            How To &nbsp;
            <QuestionCircleOutlined />
          </span>
        </Space>
      </Space>
      <Steps className={styles.stepper} labelPlacement="vertical" current={current}>
        <Step title="Download App" />
        <Step title="Add Key" />
        <Step title="Save Key" />
        <Step title="Enable" />
      </Steps>
      {current === 0 ? (
        <DownloadApp
          onSuccess={() => {
            setCurrent(1);
          }}
        />
      ) : null}
      {current === 1 ? (
        <AddKey
          secretKey={secretKey}
          secretUrl={secretUrl}
          onSuccess={() => {
            setCurrent(2);
          }}
        />
      ) : null}
      {current === 2 ? (
        <SaveKey
          secretKey={secretKey}
          onSuccess={() => {
            setCurrent(3);
          }}
        />
      ) : null}
      {current === 3 ? <Enable error={error} setError={setError} onSuccess={handleEnable} /> : null}
    </div>
  );
};

export default MFAEnable;
