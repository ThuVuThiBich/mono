import { DownloadOutlined } from '@ant-design/icons';
import { Button } from '@cross/ui';
import { Space } from 'antd';
import { FC } from 'react';
import styles from './styles.module.less';
interface SaveKeyProps {
  secretKey: string;
  onSuccess?: () => void;
}

const SaveKey: FC<SaveKeyProps> = ({ onSuccess, secretKey }) => {
  const downloadData = () => {
    var blob = new Blob([secretKey], { type: 'text/csv' });
    if ((window.navigator as any).msSaveOrOpenBlob) {
      (window.navigator as any).msSaveBlob(blob, 'secret.txt');
    } else {
      var elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = 'secret.txt';
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
  };

  return (
    <div className={styles.root}>
      <p className="text-14 center">
        Open an authentication app and scan the QR code or directly add the following key to the app.
      </p>
      <Space className="f-center mb-8">
        <p className="m-0">{secretKey}</p>
        <Button onClick={downloadData}>
          <DownloadOutlined />
        </Button>
      </Space>
      <div className="f-center">
        <Button className={styles.btnGoBack} onClick={onSuccess} type="primary">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default SaveKey;
