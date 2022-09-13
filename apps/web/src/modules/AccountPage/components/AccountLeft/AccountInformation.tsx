import { UserOutlined } from '@ant-design/icons';
import { Col, Form, message, Row, Spin, Upload } from 'antd';
import clsx from 'clsx';
import { FC, useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import styles from './AccountInformation.module.css';

import { Avatar, Button, InputWithLabel, Option, SelectWithLabel, Surface } from '@cross/ui';
import { changeAvatarRequest, changeNickName, useCurrencyGroupItem, useUser } from 'api/account';
import { TError } from 'api/types';
import { useAppDispatch, useAppSelector, useTypeSafeTranslation } from 'hooks';
import { coinSymbol } from 'modules/AccountPage/constant';
import { getCurrentCurrency, setCurrentCurrency } from 'store/ducks/account/slice';
import { fileChangeValidator, nicknameRule } from 'utils/validator';

const validateForm = {
  required: '* ${label} is required!',
  types: {
    email: '* ${label} is not a valid email!',
  },
};

const selectedCurrency = ['USD', 'JPY', 'CNY', 'EUR', 'GBP', 'KRW', 'TWD', 'TRY'];

const AccountInformation: FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const { t } = useTypeSafeTranslation();
  const [btnEdit, setBtnEdit] = useState(false);
  const currentCurrency = useAppSelector(getCurrentCurrency);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      nickName: user?.nickName,
      email: user?.account,
      uuid: user?.accountIdHex,
    });
  }, [form, user]);

  const { mutateAsync: mutateNickname, isLoading: changeNickNameLoading } = useMutation(changeNickName, {});

  const { mutate: changeAvatar, isLoading: changeAvatarLoading } = useMutation(changeAvatarRequest, {
    onSuccess: async () => {
      setTimeout(async () => {
        // checkSession();
      }, 2000);
    },
    onError: (error: TError) => {
      message.error(error.msg_code);
    },
  });

  const { data: currencyList } = useCurrencyGroupItem({
    select: (currencyGroup) => {
      if (!currencyGroup) return [];
      const tempCurrency = currencyGroup
        .filter((el) => selectedCurrency.includes(el?.coinType))
        .map((entry) => {
          return {
            ...entry,
            symbol: coinSymbol[entry?.coinType].type,
          };
        });

      return tempCurrency;
    },
  });

  const onSave = async (values: any) => {
    try {
      if (user?.nickName !== values.nickName) {
        await mutateNickname({
          nickName: values.nickName,
        });
      }

      const tempCurrency = currencyList?.find((element: any) => element.coinType === values.localCurrency);
      dispatch(setCurrentCurrency(tempCurrency));
      message.success('update successfully');
      setBtnEdit(false);
    } catch (err: any) {
      message.error(err.msg_code);
    }
  };

  const onAvatarChange = async (info: any) => {
    try {
      const avatarFile = info.file;
      await fileChangeValidator(avatarFile, 5, t);

      changeAvatar(avatarFile);
    } catch (err) {
      console.log(err);
    }
  };

  const timezone = useMemo(() => {
    const d = new Date();
    const timeZoneOffset: any = d.getTimezoneOffset();
    let f = '';
    if (timeZoneOffset <= 0) f = '+';

    let ss: any = -timeZoneOffset % 60;
    if (ss === 0) ss += '0';

    const time = -(timeZoneOffset / 60) + ':' + ss;
    const utc_time = '(UTC' + f + time + ')';
    const country = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/');

    return (country[1] || country[0] || '') + ' ' + utc_time;
  }, []);

  const isLoading = changeNickNameLoading;

  return (
    <Spin spinning={isLoading}>
      <Form
        onFinish={onSave}
        form={form}
        initialValues={{
          localCurrency: currentCurrency.coinType || '',
          token_daily_report: false,
        }}
        validateMessages={validateForm}
      >
        <Surface borderMd className={styles.root}>
          <Row className={styles.headInfo}>
            <Col sm={12} lg={15} xs={15}>
              <div className={clsx(styles.avatarPic, 'f-start')}>
                <Avatar src={''} className={styles.avatar} size={98} icon={<UserOutlined />} />
                <div className={styles.upload}>
                  <span className="text-14 primary">Upload Picture</span>
                  <p className="text-12 secondary">Max file size 5MB</p>
                  <Upload
                    beforeUpload={() => false}
                    listType="picture"
                    maxCount={1}
                    name="upload"
                    showUploadList={false}
                    onChange={onAvatarChange}
                  >
                    <Button loading={changeAvatarLoading} className={styles.btnGo} type="primary">
                      Upload
                    </Button>
                  </Upload>
                </div>
              </div>
            </Col>
            <Col sm={12} lg={9} xs={9}>
              <div className={styles.headLeft}>
                {/* <Link href={routes.changePassword} passHref>
                  <ButtonAnt type="text" className={styles.textChangePass}>
                    <Space className="text-14">
                      {t('account_management.information.change_password')}
                      <FontAwesomeIcon icon={faArrowRight} />
                    </Space>
                  </ButtonAnt>
                </Link> */}
                {btnEdit && !isLoading && (
                  <Button loading={changeNickNameLoading} htmlType="submit" type="secondary">
                    Save
                  </Button>
                )}
                {!btnEdit && !isLoading && (
                  <Button type="primary" onClick={() => setBtnEdit(true)}>
                    Edit
                  </Button>
                )}
              </div>
            </Col>
          </Row>
          <div className={styles.form}>
            <Form.Item
              label="Nickname"
              name="nickName"
              rules={[
                { required: true, whitespace: true },
                {
                  async validator(_, value) {
                    return await nicknameRule(value, t);
                  },
                },
              ]}
            >
              <InputWithLabel
                disabled={btnEdit === false ? true : false}
                id="nickname"
                label="Nickname"
                placeholder="Your Nickname"
              />
            </Form.Item>
            <Form.Item name="email">
              <InputWithLabel disabled id="email" label="Email" placeholder="Your Email" />
            </Form.Item>
            <Form.Item name="phone">
              <InputWithLabel disabled id="phone" label="Phone" placeholder="Your Phone" />
            </Form.Item>

            <Form.Item name="uuid">
              <InputWithLabel disabled id="uuid" label="UUID" />
            </Form.Item>

            <Form.Item name="referralCode">
              <InputWithLabel disabled label="Referral Code" />
            </Form.Item>
            <Form.Item name="inviter">
              <InputWithLabel disabled label="Inviter" />
            </Form.Item>
            <Form.Item name="localCurrency">
              <SelectWithLabel disabled={!btnEdit} id="localCurrency" label="Local Currency">
                {currencyList?.map((entry: any, index) => {
                  return (
                    <Option key={index} value={entry.coinType}>
                      {entry.coinType}
                    </Option>
                  );
                })}
              </SelectWithLabel>
            </Form.Item>

            <Form.Item>
              <InputWithLabel disabled id="timeZone" label="Time Zone" defaultValue={timezone} />
            </Form.Item>
          </div>
        </Surface>
      </Form>
    </Spin>
  );
};

export default AccountInformation;
