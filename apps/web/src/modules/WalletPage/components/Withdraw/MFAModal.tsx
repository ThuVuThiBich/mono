import { Divider, Form, message, Space, Tooltip } from 'antd';
import { FC, useEffect, useState } from 'react';
import styles from './MFAModal.module.less';

import { Button, InputWithLabel, Modal } from '@cross/ui';
import { TError } from 'api/types';
import { getWithDrawEmailCodeRequest, sendWithDrawEmailRequest } from 'api/wallet/request';
import { ISendWithdrawEmailParams } from 'api/wallet/types';
import clsx from 'clsx';
import { useCountdown } from 'hooks';
import { useMutation, useQueryClient } from 'react-query';
import SuccessModal from './SuccessModal';
import { getUserEmail } from 'store/ducks/account/slice';
import { useUser } from 'api/account';

interface MFAModalProps {
  payload: ISendWithdrawEmailParams;
  onClose: () => void;
  onFinish: () => void;
}
let hideEmail = function (email?: any) {
  if (!email) return '';
  return email.replace(/(.{3})(.*)(?=@)/, function (gp1: any, gp2: any, gp3: any) {
    for (let i = 0; i < gp3.length; i++) {
      gp2 += '*';
    }
    return gp2;
  });
};

const MFAModal: FC<MFAModalProps> = ({ payload, onClose, onFinish }) => {
  const [form] = Form.useForm();
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useUser();


  const [isClicked, setIsClicked] = useState(false);
  const { countDown, isStart, toggleStart } = useCountdown(60);

  const { mutate, isLoading } = useMutation(sendWithDrawEmailRequest, {
    onSuccess: () => {
      setOpenSuccessModal(true);
      queryClient.invalidateQueries('/bb/asset/show');
    },
    onError: (err: TError) => {
      console.log(err);
      message.error(err.message);
    },
  });

  const [, forceUpdate] = useState({});

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const { mutate: getWithdrawCode } = useMutation(getWithDrawEmailCodeRequest, {
    onSuccess: () => {},
    onError: (err: any) => {
      message.error(err.data || err.message);
    },
  });

  const handleSubmit = (formValue: any) => {
    if (!isClicked) {
      return form.setFields([{ name: 'email_code', errors: ['Please get a verification code first.'] }]);
    }

    mutate({
      ...payload,
      '2fa-code': formValue.code,
      'email-code': formValue.email_code,
    });
  };

  const handleGetCode = () => {
    toggleStart();
    getWithdrawCode(payload);

    if (!isClicked) {
      form.setFields([{ name: 'email_code', errors: [] }]);
    }
    setIsClicked(true);
  };

  return (
    <>
      <Modal
        maskClosable={false}
        centered
        closable={!isLoading}
        visible={!!payload && !openSuccessModal}
        onCancel={onClose}
      >
        <div className={styles.header}>
          <div className="uppercase bold">SECURITY VERIFICATION</div>
        </div>
        <Divider />

        <Form form={form} onFinish={handleSubmit}>
          <p className="uppercase bold my-8">VERIFICATION CODE FROM EMAIL</p>
          <Form.Item name="email_code" rules={[{ required: true, message: '' }]}>
            <InputWithLabel
              type="number"
              onKeyDown={(evt) => (evt.key === '.' || evt.key === '-' || evt.key === 'e') && evt.preventDefault()}
              surfaceClassName={styles.input}
              suffix={
                !isStart ? (
                  <a className={styles.getCodeBtn} onClick={handleGetCode}>
                    {isClicked ? 'Resend Code' : 'Get Code'}
                  </a>
                ) : (
                  <Space className={styles.getCodeBtn}>
                    Verification code sent
                    <Tooltip
                      title={`Haven’t received code? Request new code in ${countDown} seconds. The code will expire after 10 mins.`}
                    >
                      <img width={18} src="/images/svgs/exclamation-disabled.svg" alt="exclamation-disabled" />
                    </Tooltip>
                  </Space>
                )
              }
              autoFocus
            />
          </Form.Item>

          <Form.Item noStyle shouldUpdate>
            {({ getFieldError }) => {
              return (
                <>
                  <i
                    className={clsx(styles.helpText, {
                      [styles.mt]: getFieldError('email_code')?.length > 0,
                    })}
                  >
                    Enter 6-digit code sent to {hideEmail(getUserEmail)}
                  </i>
                </>
              );
            }}
          </Form.Item>

          <p className="uppercase bold my-8">2FA CODE</p>
          <Form.Item name="code" rules={[{ required: true, message: '' }]}>
            <InputWithLabel
              type="number"
              onKeyDown={(evt: any) => (evt.key === '.' || evt.key === '-' || evt.key === 'e') && evt.preventDefault()}
              surfaceClassName={styles.input}
              autoFocus
              suffix={<></>}
            />
          </Form.Item>

          <Form.Item noStyle shouldUpdate className='f-center'>
            {({ getFieldValue }) => {
              return (
                <>
                  <Button
                    disabled={!getFieldValue('email_code') || !getFieldValue('code')}
                    loading={isLoading}
                    className={styles.btnSubmit}
                    htmlType="submit"
                    type="secondary"
                  >
                    Submit
                  </Button>
                </>
              );
            }}
          </Form.Item>
        </Form>
      </Modal>
      <SuccessModal onOk={onFinish} open={openSuccessModal} />
    </>
  );
};

export default MFAModal;
