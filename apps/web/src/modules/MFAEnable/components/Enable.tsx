import { Button } from '@cross/ui';
import clsx from 'clsx';
import { useAppDispatch } from 'hooks';
import { FC, useEffect, useState } from 'react';
import AuthCode from 'react-auth-code-input';
import { setAuthModal } from 'store/ducks/system/slice';
import styles from './styles.module.less';

interface EnableProps {
  error: boolean;
  setError: (isError: boolean) => void;
  onSuccess?: (code: string) => void;
}

const Enable: FC<EnableProps> = ({ error, setError, onSuccess }) => {
  const [code, setCode] = useState<string>('');
  const handleOnChange = (res: string) => {
    setError(false);
    setCode(res);
  };

  const handleEnable = () => {
    if (onSuccess) onSuccess(code);
  };

  return (
    <div className={styles.root}>
      <p className="text-14 center">Please enter the 6 digit key displayed in the authentication app.</p>
      <div className="f-center">
        <AuthCode
          onChange={handleOnChange}
          allowedCharacters="numeric"
          inputClassName={clsx(styles.styledInput, error && styles.errorCode)}
          containerClassName={styles.styledContainer}
        />
      </div>
      <div className="f-center">
        <Button className={styles.btnEnable} onClick={handleEnable} type="primary" disabled={code.length < 6}>
          Enable
        </Button>
      </div>
    </div>
  );
};

export default Enable;
