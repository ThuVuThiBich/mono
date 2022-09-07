import { Button, Col, Row } from 'antd';
import React, { FC } from 'react';
import styles from './styles.module.less';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { useTypeSafeTranslation } from 'hooks';

const Banners: FC = () => {
  const { t } = useTypeSafeTranslation();
  const [copy] = useCopyToClipboard();
  return (
    <div className={styles.root}>
      <Row gutter={[40, 16]}>
        {Array.from(Array(4).keys()).map((num) => (
          <Col className={styles.item} key={num} xs={24} lg={12}>
            <div className={styles.muted}>1200 x 750 :</div>
            <img
              className={styles.background}
              src="http://v2.visionmanagement.com.mx/wp-content/uploads/2016/03/default_image_01-1024x1024-570x321.png"
              alt=""
            />
            <div className={styles.download}>
              <a
                href="http://v2.visionmanagement.com.mx/wp-content/uploads/2016/03/default_image_01-1024x1024-570x321.png"
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <Button type="text">
                  <span className={styles.downloadText}>{t('referral.other.download_image')}</span>{' '}
                  <FontAwesomeIcon className={styles.downloadIcon} icon={faArrowDown} />
                </Button>
              </a>
            </div>
            <div className={styles.panel}>
              <span className={styles.label}>{t('referral.other.embed_code')}</span>
              <div className={styles.text}>{'<a href="https://ultorex.com/refferals">Ultorex</a>'}</div>
              <div className={styles.separator}></div>
              <img
                className={styles.copy}
                src="/images/referrals/copy-duotone.svg"
                alt=""
                onClick={() => copy('<a href="https://ultorex.com/refferals">Ultorex</a>')}
              />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Banners;
