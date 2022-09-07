import React, { FC } from 'react';
import styles from './MainCard.module.less';
import { useUser } from '@auth0/nextjs-auth0';
import { Col, Popover, Row, Space } from 'antd';
import { useReferralInfo } from 'api/kyc/queries';
import clsx from 'clsx';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
// import Qrcode from 'qrcode.react';
import { baseUrl } from 'utils/constant';
import { useToggle, useTypeSafeTranslation } from 'hooks';
// import { EditOutlined } from '@ant-design/icons';
import { ShareRateModal } from './ShareRateModal';
import { useRewardRate } from 'api/referral';
import { formatNumber } from 'utils/number';
import BigNumber from 'bignumber.js';
import { InputWithLabel } from '@cross/ui';
import QRCode from 'qrcode.react';

interface MiniCardProps {
  num: string;
  img: string;
  title: string;
  description: string;
}

const MiniCard: FC<MiniCardProps> = ({ num, img, title, description }) => {
  return (
    <div className={styles.miniCard}>
      <div className={styles.number}>{num}</div>
      <div>
        <img src={img} alt="title" />
        <h2>{title}</h2>
      </div>
      <p>{description}</p>
    </div>
  );
};

const MainCard: FC = () => {
  const { t } = useTypeSafeTranslation();
  const [openModal, toggleModal] = useToggle(false);
  const [copy] = useCopyToClipboard();
  // const { user } = useUser();
  const user = { sub: '' };
  const { data, isFetching, error } = useReferralInfo({ sub: user?.sub || '' });
  const { data: rewardRate } = useRewardRate();

  return (
    <div className={styles.root}>
      <img src="/images/svgs/handshake.svg" alt="handsake" />
      <Row gutter={[0, 12]} justify="space-between" align="top">
        <Col xs={24} lg={8} xl={10}>
          <h1 className={styles.bigTitle}>Invite & Earn</h1>
        </Col>
        <Col xs={24} lg={16} xl={14}>
          <Row gutter={[18, 32]} justify="center">
            <Col xs={24} md={12} lg={8}>
              <MiniCard
                num="1"
                img="/images/svgs/link.svg"
                title="Get Your Link"
                description="Register and generate referral links and QR codes."
              />
            </Col>

            <Col xs={24} md={12} lg={8}>
              <MiniCard
                num="2"
                img="/images/svgs/people.svg"
                title="Invite Friends"
                description="Invite your friends to register through the referral link or QR codes and get rewards once they complete a trade."
              />
            </Col>

            <Col xs={24} md={12} lg={8}>
              <MiniCard
                num="3"
                img="/images/svgs/reward.svg"
                title="Get Rewards"
                description="Receive up to 40% commission in real-time."
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <div className={styles.refferalId}>
            <label className={styles.label}>Your Referral ID:</label>
            <InputWithLabel
              disabled
              label={error ? t('referral.REFERRAL_COMING_SOON') : isFetching ? '...' : data?.referralCode || ''}
              surfaceClassName={clsx(styles.inputLabel)}
              className={clsx(styles.input)}
              readOnly
              suffix={
                <div className={styles.inputSuffix}>
                  <div className={styles.verticalDivider} />
                  <a onClick={() => copy(data?.referralCode || '')}>
                    <img src="/images/svgs/copy-black.svg" alt="cpy" />
                  </a>
                </div>
              }
            />
          </div>

          <Space size="large">
            <div>
              <label className={styles.label}>Commission Rate:</label>
              <div className={styles.rateInfo}>
                <InputWithLabel
                  disabled
                  label={`${formatNumber(new BigNumber(rewardRate?.mine || 0.03).multipliedBy(100).toString(), 3)} %`}
                  surfaceClassName={clsx(styles.inputLabel, styles.rateInput)}
                  className={clsx(styles.input)}
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className={styles.label}>Share Rate:</label>
              <div className={styles.rateInfo}>
                <InputWithLabel
                  disabled
                  label={`${Number(rewardRate?.shareRate || 0) * 100} %`}
                  surfaceClassName={clsx(styles.inputLabel, styles.rateInput)}
                  className={clsx(styles.input)}
                  readOnly
                />
                {/* <button onClick={toggleModal} className={styles.updateRateButton}>
                  <EditOutlined />
                </button> */}
              </div>
            </div>
          </Space>

          <div className={styles.footer}>
            <div className={styles.refferalLink}>
              <label className={styles.label}>Invite with Your Link:</label>
              <InputWithLabel
                disabled
                value={
                  error
                    ? t('referral.REFERRAL_COMING_SOON')
                    : isFetching
                    ? t('common.loading')
                    : `${baseUrl}/register?ref_code=${data?.referralCode || ''}`
                }
                surfaceClassName={styles.inputLabel}
                className={styles.input}
                readOnly
                label={t('referral.card.ref_link')}
                suffix={
                  <div className={styles.inputSuffix}>
                    <div className={styles.verticalDivider} />
                    <a onClick={() => copy(`${baseUrl}/register?ref_code=${data?.referralCode || ''}`)}>
                      <img src="/images/svgs/copy-black.svg" alt="cpy" />
                    </a>
                    <div className={styles.verticalDivider} />

                    <Popover
                      overlayClassName={styles.popover}
                      content={
                        <QRCode value={`${baseUrl}/register?ref_code=${data?.referralCode || ''}`} type="text" />
                      }
                    >
                      <a>
                        <img src="/images/svgs/qrcode-duotone.svg" alt="qrcode" />
                      </a>
                    </Popover>
                  </div>
                }
              />
            </div>

            {/* <Space direction="vertical">
              <label className={styles.label}>{t('referral.card.if_you_have_a_website')}</label>
              <Link href={`${routes.referral}?tab=banners`} passHref>
                <Button type="primary">{t('referral.card.get_banner')}</Button>
              </Link>
            </Space> */}
          </div>
        </Col>
      </Row>
      <ShareRateModal open={openModal} onClose={toggleModal} />
    </div>
  );
};

export default MainCard;
