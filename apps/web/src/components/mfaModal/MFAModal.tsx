import { Button, Input, Modal } from '@cross/ui';
import { useAppDispatch, useAppSelector, useTypeSafeTranslation } from 'hooks';
import { useRouter } from 'next/router';
import { FC, useMemo, useState } from 'react';
import NumberFormat from 'react-number-format';
import { getMFAModal, toggleMFAModal } from 'store/ducks/system/slice';

import styles from './styles.module.less';

interface IMFAModalProps {
  onHandleModal: (code: string) => void;
}

const MFAModal: FC<IMFAModalProps> = ({ onHandleModal }) => {
  const isVisibleMFAModal = useAppSelector(getMFAModal);
  const [authCode, setAuthCode] = useState('');

  // useEffect(() => {
  //   if (dataLogin.code === 0) {
  //     if (dataLogin.user) {
  //       // if (history.location.state) {
  //       //   return history.push(history.location.state.pathname);
  //       // }
  //       // return history.push('/');
  //     } else {
  //       toggleMFAModal(true);
  //     }
  //   }
  //   if (dataLogin.code !== 0 && dataLogin.messageError) {
  //     return message.error(dataLogin.messageError);
  //   }
  // }, [dataLogin]);

  const handleConfirm2AuthStep = (authCode: string) => {
    // dispatch(
    //   applyAuthCodeAction({
    //     googleCode: authCode,
    //     authenType: '',
    //   })
    // );
    // if (dataLogin.code === 0) {
    //   toggleMFAModal(false);
    // }
  };
  const handleChangeVerificationInput = (e: any) => {
    setAuthCode(e.target.value);
    if (e.target.value.length === 6) handleConfirm2AuthStep(e.target.value);
  };

  const handleModal = () => {
    onHandleModal(authCode);
  };

  return (
    <Modal
      width={400}
      title="2-Step Authentication"
      visible={isVisibleMFAModal}
      onOk={() => handleConfirm2AuthStep(authCode)}
      onCancel={() => {
        toggleMFAModal(false);
        setAuthCode('');
      }}
    >
      <p>Get a verification code from the Google Authenticator (or similar) app:</p>
      <NumberFormat
        customInput={Input}
        placeholder="Enter The 6-Digit Code"
        onChange={handleChangeVerificationInput}
        allowLeadingZeros
        autoFocus={true}
      />

      <div className="f-center my-8">
        <Button onClick={handleModal}>Confirm</Button>
      </div>
    </Modal>
  );
};

export default MFAModal;
