import { FC, useState } from 'react';
import styles from './styles.module.less';
import { Form, Row, Col, message } from 'antd';
import { Input, InputWithLabel, Checkbox, Button } from '@cross/ui';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { validateEmail } from 'utils/validator';
import { useMutation, useQueryClient } from 'react-query';
import { TError } from 'api/types';
import { login } from 'api/auth';
import { setCookies } from '@cross/cookies';
import { USER_COOKIES } from 'utils/constant';
import { useRouter } from 'next/router';
import { routes } from 'types/routes';
import { useUser } from 'api/account';
import { getUserAuth, setUserAuth } from 'store/ducks/account/slice';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'hooks';
import MFAModal from 'components/mfaModal/MFAModal';
import { getMFAModal, toggleMFAModal } from 'store/ducks/system/slice';
import { enter } from 'api/gg_auth';
const Login: FC = () => {
  const t = useTranslation();
  const router = useRouter();
  const { refetch, user } = useUser();
  // if (user) {
  //   router.push(routes.home);
  // }
  const dispatch = useDispatch();
  const userData = useAppSelector(getUserAuth);
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
