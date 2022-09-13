import { setCookies } from '@cross/cookies';
import { Button, Checkbox, InputWithLabel } from '@cross/ui';
import { Col, Form, message, Row } from 'antd';
import { useUser } from 'api/account';
import { login } from 'api/auth';
import { enter } from 'api/gg_auth';
import { TError } from 'api/types';
import MFAModal from 'components/mfaModal/MFAModal';
import { useAppSelector } from 'hooks';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { setUserAuth } from 'store/ducks/account/slice';
import { getMFAModal, toggleMFAModal } from 'store/ducks/system/slice';
import { routes } from 'types/routes';
import { USER_COOKIES } from 'utils/constant';
import { validateEmail } from 'utils/validator';
import styles from './styles.module.less';
const Login: FC = () => {
  const t = useTranslation();
  const router = useRouter();
  const { refetch } = useUser();
 
  const dispatch = useDispatch();
  const isVisibleMFAModal = useAppSelector(getMFAModal);
  const [emailValidateType, setEmailValidateType] = useState<'onBlur' | 'onChange'>('onBlur');
  const { mutateAsync: mutateToken } = useMutation(login, {
    onError(error: TError) {
      message.error(error.msg_code as any);
    },
  });
  const handleForm = async (values: any) => {
    const paramsLogin = { account: values.email, password: values.password };
    const data = await mutateToken(paramsLogin);
    if (data) {
      dispatch(setUserAuth(data));
      setCookies(USER_COOKIES.userAccessToken, data.token);
      await refetch();
      const nextRoute = (router.query?.redirect as string) || routes.home;
      data['google-auth'] ? dispatch(toggleMFAModal(true)) : router.push(nextRoute);
    }
  };

  const { mutateAsync: mutateEnterAuthCode } = useMutation(enter, {
    onError(error: TError) {
      message.error(error.msg_code as any);
    },
    onSuccess: () => {
      dispatch(toggleMFAModal(false));
      router.push(routes.home);
    },
  });

  const onHandleModal = (code: string) => {
    mutateEnterAuthCode({ googleCode: code });
  };

  return (
    <div className="container">
      <Row className={styles.login}>
        <Col className={styles.title} span={24}>
          Login
        </Col>
        <Col span={24}>
          <Form onFinish={handleForm}>
            <Form.Item
              name="email"
              validateTrigger={emailValidateType}
              rules={[
                {
                  required: true,
                  validator(_, value) {
                    if (!validateEmail(value)) {
                      return Promise.reject(new Error('Email invalid'));
                    }
                    return Promise.resolve('');
                  },
                },
              ]}
            >
              <InputWithLabel
                onBlur={() => setEmailValidateType('onChange')}
                type="email"
                placeholder="Your Email"
                label="email"
              />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <InputWithLabel type="password" placeholder="Your Password" label="Password" />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Keep me logged in on this computer</Checkbox>
            </Form.Item>

            <Form.Item className={styles.wrapButton}>
              <Button htmlType="submit" className={styles.btnLogin} type="primary">
                Login
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={24}>
          <Row align="middle">
            <Col span={4}>
              <Button
                onClick={() => {
                  router.push(routes.register);
                }}
                className={styles.Register}
                type="primary"
              >
                Register
              </Button>
            </Col>
            <Col span={16} offset={2}>
              if you don’t have an account
            </Col>
          </Row>
        </Col>
        <Col className={styles.link} span={24}>
          <Link passHref href={'/'}>
            <span>Forgot password?</span>
          </Link>
        </Col>
      </Row>
      {isVisibleMFAModal && <MFAModal onHandleModal={onHandleModal} />}
    </div>
  );
};

export default Login;
