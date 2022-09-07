import { FC } from 'react';
import { Space, Col, Row, Tooltip, Spin } from 'antd';
import styles from './Limit.module.css';
import Link from 'next/link';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Trans, useTranslation } from 'next-i18next';

import { useGetUserInfo, useWithdrawLimit } from 'api/account';
import { Surface } from '@cross/ui';

const LimitElement: FC = () => {
  const { t } = useTranslation();
  const { data } = useWithdrawLimit();
  const { data: user } = useGetUserInfo();

  return (
    <>
      <div className={styles.card}>
        <p className="text-12 small">Crypto Withdraw Limit</p>
        <Row gutter={15}>
          <Col>
            <Surface className={styles.report} borderLess>
              <span className="text-14 light">Daily</span>
              <div className="default center">
                {user?.kyc_status === 2 ? (
                  <>
                    <span className="text-18 small">{data?.['daily-limit']}</span>
                    <span className="small"> BTC</span>
                  </>
                ) : (
                  <>
                    <span className="text-18 small">0</span>
                    <span className="small"> BTC</span>
                  </>
                )}
              </div>
            </Surface>
          </Col>
          <Col>
            <Surface className={styles.report} borderLess>
              <span className="text-14 light">Monthly</span>
              <div className="default center">
                <span className="text-18 small">
                  {user?.kyc_status === 2 ? (
                    t('account_management.no.limit')
                  ) : (
                    <>
                      0 <span className="small"> BTC</span>
                    </>
                  )}
                </span>
              </div>
            </Surface>
          </Col>
        </Row>
      </div>
      <Tooltip placement="topLeft" title="By conducting KYC ...">
        <FontAwesomeIcon icon={faInfoCircle} className={styles.iconInfo} />
        <Link href="#">
          <a className={styles.link}>How to increase your limits?</a>
        </Link>
      </Tooltip>
    </>
  );
};

const Limit: FC = () => {
  const { t } = useTranslation();
  const { isLoading } = useWithdrawLimit();

  return (
    <Spin spinning={isLoading}>
      <Surface borderMd className={styles.root}>
        <Tooltip placement="topRight" title="Display Crypto Withdraw Limit by Daily, Month" color={'#22242a'}>
          <FontAwesomeIcon icon={faQuestionCircle} className={styles.icon} />
        </Tooltip>
        <Space direction="vertical" className={clsx('w-100', styles.form)}>
          <h3 className={styles.textLimit}>Limits</h3>
          <Row>
            <Col xs={{ order: 2, span: 24 }} sm={{ order: 1, span: 18 }}>
              <LimitElement />
            </Col>
          </Row>
        </Space>
      </Surface>
    </Spin>
  );
};

export default Limit;
