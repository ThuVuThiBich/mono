import React, { useState, useRef } from 'react';
import styles from './FileUpload.module.css';
import clsx from 'clsx';
import { Row, Col, Upload, message } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { useTypeSafeTranslation } from 'hooks';
import { Button, Surface } from '@cross/ui';

interface FileUploadProps {
  label?: string;
  description?: string;
  lists?: string[];
  style?: React.CSSProperties;
  background?: string;
  backgroundHeight?: number;
  onChangeFile?: Function;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  description,
  lists,
  style,
  background,
  backgroundHeight,
  onChangeFile,
}) => {
  const { t } = useTypeSafeTranslation();
  const [file, setFile] = useState<UploadFile>();
  const uploader = useRef();

  const onChange = (info: UploadChangeParam) => {
    const file = info?.file;

    if (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      if (!isJpgOrPng) {
        message.error(t('e_UPLOAD_FILE_TYPE' as any, { ns: 'error' }));
        return;
      }
      const isLt5M = (file.size as number) / 1024 / 1024 < 4;
      if (!isLt5M) {
        message.error(t('e_UPLOAD_FILE_SIZE' as any, { ns: 'error' }));
        return;
      }
    }

    setFile(file);
    if (onChangeFile) {
      onChangeFile(file);
    }
    return false;
  };

  const beforeUpload = () => {
    return false;
  };

  return (
    <Surface className={clsx(styles.container, null)} style={style}>
      <label className={clsx(styles.label)}>{label}</label>
      <p className={clsx(styles.description)}>{description}</p>
      {lists ? (
        <ul className={clsx(styles.list)}>
          {lists.map((txt, pos) => (
            <li key={pos}>{txt}</li>
          ))}
        </ul>
      ) : null}
      <Upload
        name="upload"
        className={clsx(styles.uploader)}
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={onChange}
        ref={uploader}
        maxCount={1}
        accept="image/png, image/jpeg, image/gif"
      >
        <div className={clsx(styles.backgroundWrap)}>
          {file ? (
            <img className={clsx(styles.uploadFileImage)} alt="preview" src={URL.createObjectURL(file as any)} />
          ) : background ? (
            <img
              className={clsx(styles.uploadBackground)}
              alt="preview"
              src={background}
              style={{ height: backgroundHeight }}
            />
          ) : null}
          {/* {file !== null ? <p>{file?.name}</p> : null} */}
        </div>
        <Row justify="end">
          <Col>
            <Button type="primary" size="small">
              Upload
            </Button>
          </Col>
        </Row>
      </Upload>
    </Surface>
  );
};
