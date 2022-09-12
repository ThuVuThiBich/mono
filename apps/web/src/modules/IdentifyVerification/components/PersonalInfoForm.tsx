import React, { useMemo } from 'react';
import styles from './PersonalInfoForm.module.css';
import { Col, Form, Row, Space } from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { countries } from 'modules/IdentifyVerification/constant/countries';
import { useTypeSafeTranslation } from 'hooks';
import { alphanumericalRule, maxLengthRule, nicknameRule, phoneNumberRule } from 'utils/validator';
import moment from 'moment';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import {
  Avatar,
  Button,
  CheckboxWithLabel,
  DatePicker,
  InputWithLabel,
  Option,
  SelectWithLabel,
  Surface,
} from '@cross/ui';

interface PersonalInfoFormProps {
  onSuccess?: Function;
  kycData: any[];
}
const getFlagImage: any = (countryCode: string) => {
  return `/images/currency/${countryCode.toLowerCase()}.png`;
};

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onSuccess, kycData }) => {
  const { t } = useTypeSafeTranslation();
  const [data, setData] = kycData;
  const { xs } = useBreakpoint();

  const onFinish = (values: any) => {
    setData({ ...data, ...values, birthday: values.birthday.format('YYYY-MM-DD') });
    if (onSuccess) {
      onSuccess();
    }
  };

  const countriesSorted = useMemo(() => {
    const getNumber = (num: string) => {
      return Number(num.replace(' ', '').replace('+', ''));
    };

    return Object.keys(countries).sort((a, b) => {
      return getNumber(countries[a].dial_code) - getNumber(countries[b].dial_code);
    });
  }, [countries]);

  return (
    <Form
      onFinish={onFinish}
      initialValues={{
        ...data,
        birthday: data.birthday ? moment(data.birthday) : undefined,
      }}
    >
      <Surface className={styles.surface}>
        <Form.Item
          validateFirst
          name="firstName"
          rules={[
            { required: true, whitespace: true },
            alphanumericalRule(t),
            {
              async validator(_, value) {
                return await nicknameRule(value, t);
              },
            },
          ]}
        >
          <InputWithLabel label="First Name" placeholder="Your First Name" />
        </Form.Item>

        <Form.Item
          validateFirst
          name="lastName"
          rules={[
            { required: true, whitespace: true },
            alphanumericalRule(t),
            {
              async validator(_, value) {
                return await nicknameRule(value, t);
              },
            },
          ]}
        >
          <InputWithLabel placeholder="Your Last Name" label="Last Name" />
        </Form.Item>

        <Row gutter={8} className="w-100">
          <Col xs={24} sm={7}>
            <Form.Item name="prefixPhoneNumber" rules={[{ required: true }]}>
              <SelectWithLabel
                showSearch
                placeholder="Phone"
                filterOption={(input: any, option: any) =>
                  option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
                  option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                label={xs ? 'Phone' : undefined}
              >
                {countriesSorted.map((value: any, index: any) => {
                  return (
                    <Option title={countries[value].dial_code} value={countries[value].dial_code} key={index}>
                      <Space className="w-100" size={4} align="center">
                        <Avatar type="secondary" src={getFlagImage(value)} size={22} />
                        <span>{countries[value].dial_code}</span>
                      </Space>
                    </Option>
                  );
                })}
              </SelectWithLabel>
            </Form.Item>
          </Col>

          <Col xs={24} sm={17}>
            <Form.Item
              validateFirst
              name="phoneNumber"
              rules={[
                { required: true, whitespace: true },
                alphanumericalRule(t),
                {
                  async validator(_, value) {
                    return await phoneNumberRule(value, t);
                  },
                },
              ]}
            >
              <InputWithLabel placeholder="Your Phone" id="phone" label="Phone" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="birthday" rules={[{ required: true }]}>
          <DatePicker
            placeholder="Your Birthday"
            disabledDate={(current) => current && current > moment().endOf('day').subtract(1, 'days')}
            label="Birthday"
            inputReadOnly
          />
        </Form.Item>

        {/* <Form.Item
          validateFirst
          name="address"
          rules={[{ required: true, whitespace: true }, alphanumericalRule(t), maxLengthRule(100, t)]}
        >
          <InputWithLabel placeholder="Your Address" label="Address" />
        </Form.Item> */}

        {/* <Form.Item
          validateFirst
          name="city"
          rules={[{ required: true, whitespace: true }, alphanumericalRule(t), maxLengthRule(50, t)]}
        >
          <InputWithLabel placeholder="Your City" id="city" label="City" />
        </Form.Item> */}
        {/* 
        <Form.Item
          validateFirst
          name="prefectures"
          rules={[{ required: true, whitespace: true }, alphanumericalRule(t), maxLengthRule(100, t)]}
        >
          <InputWithLabel placeholder="Your Prefectures" label="Prefectures" />
        </Form.Item> */}

        <Form.Item name="countryCode" rules={[{ required: true }]}>
          <SelectWithLabel
            label="Country"
            showSearch
            placeholder="Your Country"
            filterOption={(input: any, option: any) => option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {Object.keys(countries).map((value: any, index: any) => {
              return (
                <Option title={countries[value].name} value={value} key={index}>
                  <span>{countries[value].name}</span>
                </Option>
              );
            })}
          </SelectWithLabel>
        </Form.Item>

        {/* <Form.Item name="nationalityCode" rules={[{ required: true }]}>
          <SelectWithLabel
            label="Nationality"
            showSearch
            placeholder="Your Nationality"
            filterOption={(input: any, option: any) => option.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {Object.keys(countries).map((value: any, index: any) => {
              return (
                <Option title={countries[value].nationality} value={value} key={index}>
                  <span>{countries[value].nationality}</span>
                </Option>
              );
            })}
          </SelectWithLabel>
        </Form.Item> */}

        <Form.Item
          validateFirst
          name="partnerCode"
          rules={[{ required: true, whitespace: true }, alphanumericalRule(t), maxLengthRule(15, t)]}
        >
          <InputWithLabel placeholder="Your PartnerCode" label="PartnerCode" />
        </Form.Item>

        {/* <Form.Item name="usCitizen" valuePropName="checked">
          <CheckboxWithLabel label="US CITIZEN" id="uscitizen" />
        </Form.Item> */}
        <Button htmlType="submit" className={styles.btnSubmit} type="secondary">
          <Space align="end">
            Continue <FontAwesomeIcon icon={faLongArrowAltRight} />
          </Space>
        </Button>
      </Surface>
    </Form>
  );
};

export default PersonalInfoForm;
