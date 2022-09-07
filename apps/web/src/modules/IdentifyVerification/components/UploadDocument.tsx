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

interface UploadDocumentProps {
  onSuccess?: Function;
  kycData: any[];
  isLoading: boolean;
}

const UploadDocument: React.FC<UploadDocumentProps> = ({ onSuccess, kycData, isLoading }) => {
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
    <Form onFinish={onFinish} form={form}>
      <Surface className={styles.surface}>
        <Form.Item name="documentType" rules={[{ required: true }]}>
          <SelectWithLabel placeholder="Choose document type" label="Document type">
            {[1, 2, 3, 4].map((option, index) => (
              <Option key={index} value={option}>
                {t(`kyc.document_type.${option}` as any)}
              </Option>
            ))}
          </SelectWithLabel>
        </Form.Item>
        <Form.Item name="identityNumber" rules={[{ required: true, whitespace: true }]}>
          <InputWithLabel placeholder="Document ID" label="Document ID" />
        </Form.Item>
        <Row gutter={[15, 15]}>
          <Col span="12">
            <Form.Item rules={[{ required: true }]} name="front">
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
                <Form.Item rules={[{ required: getFieldValue('documentType') !== 1 }]} name="back">
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
            <Form.Item rules={[{ required: true }]} name="selfie">
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
