import { Button } from '@cross/ui';
import { Space } from 'antd';
import Link from 'next/link';
import { FC } from 'react';
import styles from './styles.module.less';

interface DownloadAppProps {
  onSuccess?: () => void;
}

const DownloadApp: FC<DownloadAppProps> = ({ onSuccess }) => {
  return (
    <div className={styles.root}>
      <p className="text-14 center">Download the authentication app</p>
      <Space className="f-center">
        <Link href={'https://apps.apple.com/cn/app/google-authenticator/id388497605'} passHref>
          <a target="_blank">
            <Button>Download on App Store</Button>
          </a>
        </Link>
        <Link href={'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2'} passHref>
          <a target="_blank">
            <Button>Get it on Google Play</Button>
          </a>
        </Link>
      </Space>
      <div className="f-center">
        <Button className={styles.btnContinue} onClick={onSuccess} type="primary">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default DownloadApp;
