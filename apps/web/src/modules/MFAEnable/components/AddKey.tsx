import { Button } from '@cross/ui';
import { useAppSelector } from 'hooks';
import QRCode from 'qrcode.react';
import { FC } from 'react';
import { getUserEmail } from 'store/ducks/account/slice';
import styles from './styles.module.less';

interface AddKeyProps {
  secretKey: string;
  secretUrl: string;
  onSuccess?: () => void;
}

const AddKey: FC<AddKeyProps> = ({ secretKey, secretUrl, onSuccess }) => {
  const userEmail = useAppSelector(getUserEmail);
  return (
    <div className={styles.root}>
      <p className="text-14 center">
        Open an authentication app and scan the QR code or directly add the following key to the app.
      </p>

      <div className="f-center f-column">
        {/* <img src={apiBaseUrl + secretUrl} /> */}
        <div className={styles.qrBg}>
          <QRCode
            renderAs="svg"
            value={`otpauth://totp/${userEmail}?secret=${secretKey}&issuer=koindex.io`}
            type="text"
          />
        </div>

        <p>{secretKey}</p>
      </div>

      <div className="f-center">
        <Button className={styles.btnGoBack} onClick={onSuccess} type="primary">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default AddKey;
