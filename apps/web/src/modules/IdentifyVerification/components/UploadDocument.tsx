import React from 'react';
import styles from './UploadDocument.module.css';
import { Col, Form, Row, Space } from 'antd';

// import { FileUpload } from 'components/FileUpload';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import ProfileImage from '../assets/img/Profile.png';
import FrontSideImage from '../assets/img/FrontSide.png';
import BackSideImage from '../assets/img/BackSide.png';
import { useTypeSafeTranslation } from 'hooks';
import { Button, InputWithLabel, Option, SelectWithLabel, Surface } from '@cross/ui';
import { FileUpload } from 'components/fileUpload';
import { stableValueHash } from 'react-query/types/core/utils';

interface UploadDocumentProps {
  onSuccess?: Function;
  kycData: any[];
  isLoading: boolean;
  setCurrent: Function;
}

const UploadDocument: React.FC<UploadDocumentProps> = ({ onSuccess, kycData, isLoading, setCurrent }) => {
  const { t } = useTypeSafeTranslation();
  const [data, setData] = kycData;
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const tempData = { ...data, ...values };
    setData(tempData);
    if (onSuccess) {
      onSuccess(tempData);
    }
  };
  console.log('data Upload Document', data);

  const handleChangeFrontImage = (file: File) => {
    form.setFieldsValue({ front: file });
    // setImage((prev) => ({ ...prev, front: file }));
  };
  const handleChangeBackImage = (file: File) => {
    form.setFieldsValue({ back: file });
    // setImage((prev) => ({ ...prev, back: file }));
  };
  const handleChangeSelfieImage = (file: File) => {
    form.setFieldsValue({ selfie: file });
    // setImage((prev) => ({ ...prev, selfie: file }));
  };

  return (
    <Form
      initialValues={{ documentType: data.documentType, identityNumber: data.identityNumber }}
      onFinish={onFinish}
      form={form}
    >
      <Surface className={styles.surface}>
        <Form.Item name="documentType" rules={[{ required: true }]}>
          <SelectWithLabel placeholder="Choose document type" label="Document type">
            {[
              { id: 1, value: 'Passport' },
              { id: 2, value: "Driver's license" },
              { id: 3, value: 'ID card' },
              { id: 4, value: 'Other' },
              { id: 5, value: 'Big Customer' },
            ].map((option) => (
              <Option key={option.value} value={option.id}>
                {option.value as any}
              </Option>
            ))}
          </SelectWithLabel>
        </Form.Item>
        <Form.Item name="identityNumber" rules={[{ required: true, whitespace: true }]}>
          <InputWithLabel placeholder="Document ID" label="Document ID" />
        </Form.Item>
        <Row gutter={[15, 15]}>
          <Col span="12">
            <Form.Item name="front">
              <FileUpload
                label="Front Side"
                description="Upload the front side of your id"
                background={FrontSideImage.src}
                backgroundHeight={50}
                onChangeFile={handleChangeFrontImage}
              />
            </Form.Item>
          </Col>
          <Col span="12">
            <Form.Item
              shouldUpdate={(prevValues, currentValues) => prevValues['documentType'] !== currentValues['documentType']}
              noStyle
            >
              {({ getFieldValue }) => (
                <Form.Item name="back">
                  <FileUpload
                    label="Back Side"
                    description="Upload the back side of your id"
                    background={BackSideImage.src}
                    backgroundHeight={50}
                    onChangeFile={handleChangeBackImage}
                  />
                </Form.Item>
              )}
            </Form.Item>
          </Col>
          <Col span="24">
            <Form.Item name="selfie">
              <FileUpload
                label="Selfie"
                description="Your selfie photo must include"
                lists={[
                  'yourself',
                  'your ID held in hand',
                  'a paper “XYZ” and today’s date (MM/DD/YYYY) written on it',
                ]}
                background={ProfileImage.src}
                onChangeFile={handleChangeSelfieImage}
              />
            </Form.Item>
          </Col>
        </Row>
        <Button
          className={styles.btnGoBack}
          onClick={() => {
            const newData = {
              ...data,
              documentType: form.getFieldValue('documentType'),
              identityNumber: form.getFieldValue('identityNumber'),
            };
            setData(newData);
            setCurrent(0);
          }}
          type="primary"
        >
          Go back
        </Button>
        <Button loading={isLoading} htmlType="submit" className={styles.btnSubmit} type="secondary">
          <Space align="center">
            Submit <FontAwesomeIcon icon={faLongArrowAltRight} />
          </Space>
        </Button>
      </Surface>
    </Form>
  );
};

export default UploadDocument;
