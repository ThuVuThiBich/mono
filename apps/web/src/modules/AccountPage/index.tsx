import { disable } from 'api/gg_auth';
import { MainLayout } from 'components/mainLayout';
import MFAModal from 'components/mfaModal/MFAModal';
import { useAppDispatch, useAppSelector } from 'hooks';
import { FC, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { getMFAModal, toggleMFAModal } from 'store/ducks/system/slice';
import AccountManagement from './components';
import styles from './styles.module.less';
import { message, Space } from 'antd';
import { routes } from 'types/routes';
import { TError } from 'api/types';
import { useRouter } from 'next/router';
import { Button, Modal } from '@cross/ui';

const AccountPage: FC = () => {
  const isVisibleMFAModal = useAppSelector(getMFAModal);
  const dispatch = useAppDispatch();
  const codeRef = useRef<string>('');
  const [isOpenConfirm, setIsOpenConfirm] = useState<boolean>(false);

  const { mutateAsync: mutateDisableAuthCode } = useMutation(disable, {
    onError(error: TError) {
      message.error(error.msg_code as any);
    },
    onSuccess: () => {
      setIsOpenConfirm(false);
    },
  });

  const onHandleModal = (code: string) => {
    setIsOpenConfirm(true);
    dispatch(toggleMFAModal(false));
    codeRef.current = code;
  };

  const handleCancel = () => {
    setIsOpenConfirm(false);
  };

  const handleConfirm = () => {
    mutateDisableAuthCode({ code: codeRef.current });
  };

  return (
    <MainLayout>
      <AccountManagement />
      {isVisibleMFAModal && <MFAModal onHandleModal={onHandleModal} />}
      <Modal width={400} title="Basic Modal" onCancel={handleCancel} visible={isOpenConfirm}>
        <h1 className="text-16">Disable MFA</h1>
        <div className="my-8">Are you sure you want to disable MFA?</div>
        <Space className="f-center">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </Space>
      </Modal>
    </MainLayout>
  );
};

export default AccountPage;
