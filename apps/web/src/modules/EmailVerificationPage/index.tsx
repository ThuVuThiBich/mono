import { Button } from '@cross/ui';
import { Col, Row, message } from 'antd';
import { register } from 'api/auth';
import clsx from 'clsx';
import { useAppSelector } from 'hooks';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import AuthCode from 'react-auth-code-input';
import { useMutation } from 'react-query';
import { getRegister } from 'store/ducks/register/slice';
import styles from './styles.module.less';
import { routes } from 'types/routes';
import { TError } from 'api/types';

const EmailVerificationPage: FC = () => {
  const [code, setCode] = useState<string>('');
  const router = useRouter();
  const [error, setError] = useState<boolean>(false);
  const { email, token, password, confirmPassword } = useAppSelector(getRegister);
  const { mutateAsync: mutateRegister } = useMutation(register, {
    onError(error: TError) {
      message.error(error.msg_code as any);
      setError(true);
    },
    onSuccess() {
      router.push(routes.login);
    },
  });
  const handleOnChange = (res: string) => {
    setError(false);
    setCode(res);
  };

  const handleVerify = () => {
    if (error) return;
    mutateRegister({ account: email, token, password, passwordConfirm: confirmPassword, code });
    //call api
  };

  return (
    <div className="container">
      <Row className={styles.wrapper} justify="center">
        <Col className={styles.title} span={24}>
          EMAIL VERIFICATION
        </Col>
        <Col className={styles.description} span={24}>
          Please enter the 6-digit verification code that was sent to: {email} The code is valid for 30 minutes.
        </Col>

        <Row justify="center" align="middle" className={styles.form}>
          <Row justify="center">
            <Col className={styles.codeLabel} offset={8} span={24}>
              Verification Code
            </Col>
            <Col span={24}>
              <AuthCode
                onChange={handleOnChange}
                allowedCharacters="numeric"
                inputClassName={clsx(styles.styledInput, error && styles.errorCode)}
                containerClassName={styles.styledContainer}
              />
            </Col>
          </Row>

          <Row justify="center">
            <Button onClick={handleVerify} className={styles.btnVerify} type="primary" disabled={code.length !== 6}>
              Verify
            </Button>
          </Row>
        </Row>

        <Col span={24}>
          <Row justify="center" align="middle">
            <Col span={4}>
              <Button className={styles.btnSendAgain} type="primary">
                Send Again
              </Button>
            </Col>
            <Col span={16} offset={2}>
              if you didn’t receive the code.
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default EmailVerificationPage;
