import { FC, useState } from 'react';
import styles from './styles.module.less';
import { Form, Row, Col, message } from 'antd';
import { InputWithLabel, Checkbox, Button, InputNumberWithLabel } from '@cross/ui';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { getCode, getToken } from 'api/auth';
import { setRegister } from 'store/ducks/register/slice';
import { useMutation } from 'react-query';
import { routes } from 'types/routes';
import { useAppDispatch } from 'hooks';
import { validateEmail, validatePassword } from 'utils/validator';
import { TError } from 'api/types';
type FormRegister = {
  email: string;
  password: string;
  passwordAgain: string;
  optional: number;
  policy: boolean;
  consent: boolean;
  contact: boolean;
  referralId: string;
};
const Register: FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [emailValidateType, setEmailValidateType] = useState<'onBlur' | 'onChange'>('onBlur');
  const [passwordValidate, setPasswordValidate] = useState<'onBlur' | 'onChange'>('onBlur');
  const [confirmPasswordValidate, setConfirmPasswordValidate] = useState<'onBlur' | 'onChange'>('onBlur');

  const { mutateAsync: mutateToken } = useMutation(getToken, {
    onError(error: TError) {
      message.error(error.msg_code as any);
    },
  });
  const { mutateAsync: mutateCode } = useMutation(getCode, {
    onError(error: TError) {
      message.error(error.msg_code as any);
    },
  });

  const handleForm = async (values: FormRegister) => {
    const { token } = await mutateToken();
    const codeParam = {
      token,
      email: values.email,
      languageType: 'utf-8',
      referralId: values.referralId,
      confirmPassword: values.passwordAgain,
      password: values.password,
    };
    try {
      await mutateCode({ token, account: values.email, languageType: 'utf-8' });
      await dispatch(setRegister(codeParam));
      router.push(routes.emailVerify);
    } catch (error: any) {
      message.error(error.msg_code as any);
    }
  };
  return (
    <div className="container">
      <Row className={styles.register}>
        <Col className={styles.title} span={24}>
          Register
        </Col>
        <Col span={24}>
          <Form onFinish={handleForm} form={form}>
            <Form.Item
              name="email"
              validateTrigger={emailValidateType}
              rules={[
                {
                  required: true,
                  type: 'email',
                  validator(_, value) {
                    if (!validateEmail(value)) {
                      return Promise.reject(new Error('Email invalid'));
                    }
                    return Promise.resolve('');
                  },
                },
              ]}
            >
              <InputWithLabel onBlur={() => setEmailValidateType('onChange')} placeholder="Your Email" label="email" />
            </Form.Item>
            <Form.Item
              name="password"
              validateTrigger={passwordValidate}
              rules={[
                {
                  required: true,
                  validator(_, value) {
                    if (!validatePassword(value)) {
                      return Promise.reject(
                        new Error(
                          'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:'
                        )
                      );
                    }
                    return Promise.resolve('');
                  },
                },
              ]}
            >
              <InputWithLabel
                onBlur={() => setPasswordValidate('onChange')}
                type="password"
                placeholder="Choose a Password"
                label="Password"
              />
            </Form.Item>
            <Form.Item
              validateTrigger={confirmPasswordValidate}
              rules={[
                {
                  required: true,
                  validator(_, value) {
                    const password = form.getFieldValue('password');
                    if (password !== value) {
                      return Promise.reject(new Error('Confirm Password does not match'));
                    }
                    return Promise.resolve('');
                  },
                },
              ]}
              name="passwordAgain"
            >
              <InputWithLabel
                onBlur={() => setConfirmPasswordValidate('onChange')}
                type="password"
                placeholder="Type The Password Again"
                label="PASSWORD (AGAIN)"
              />
            </Form.Item>
            <Form.Item name="referralId">
              <InputWithLabel className={styles.inputReferral} placeholder="* Optional" label="REFERRAL ID" />
            </Form.Item>
            <Form.Item name="policy" valuePropName="checked">
              <Checkbox>
                I have read and accepted the&nbsp;
                <Link className={styles.link} href={'/'}>
                  privacy policy.
                </Link>
              </Checkbox>
            </Form.Item>
            <Form.Item name="consent" valuePropName="checked">
              <Checkbox>
                I have read and accepted the&nbsp;
                <Link className={styles.link} href={'/'}>
                  consent document for data protection.
                </Link>
              </Checkbox>
            </Form.Item>
            <Form.Item name="contact" valuePropName="checked">
              <Checkbox>
                I accept commercial electronic messages to my&nbsp;
                <Link className={styles.link} href={'/'}>
                  other contact information.
                </Link>
              </Checkbox>
            </Form.Item>
            <Form.Item className={styles.wrapButton}>
              <Row>
                <Button htmlType="submit" className={styles.btnLogin} type="primary">
                  Create Account
                </Button>
              </Row>
            </Form.Item>
          </Form>
        </Col>
        <Col span={24}>
          <Row align="middle">
            <Col span={4}>
              <Button className={styles.Register} type="primary">
                Login
              </Button>
            </Col>
            <Col span={14} offset={2}>
              if you are already registered
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
