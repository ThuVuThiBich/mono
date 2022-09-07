import React, { FC, useMemo } from 'react';
import styles from './RewardRate.module.less';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Space } from 'antd';
import { useReferralRank } from 'api/dashboard';
import { useRewardTable } from 'api/referral';
import { RateLevelProgress } from 'components/rateLevelProgress';
import { useTypeSafeTranslation } from 'hooks';
import Hide from 'components/Hide';
import clsx from 'clsx';
import { Surface } from '@cross/ui';

const RewardRate: FC = () => {
  const { t } = useTypeSafeTranslation();
  const { data: ranks } = useReferralRank();

  const { data: rewardTable } = useRewardTable();

  const isMaxLevel = useMemo(() => {
    if (!ranks) return false;
    return Number(ranks.lv) === 7;
  }, [ranks]);

  return (
    <Surface className={styles.root}>
      <span className="bold">{t('referral.other.your_reward_rate')}</span>
      <Divider className="m-0" />

      <RateLevelProgress />

      <div className={clsx(styles.rateInProgress, isMaxLevel && 'f-center w-100')}>
        <Space align="start" direction="vertical">
          <b className="bolder avenir">{t('referral.other.lvl_rate', { count: (ranks?.lv || 1) as any })}</b>
          <div className={styles.rateBox}>
            <b>
              {rewardTable ? Number(Number(rewardTable[Number(ranks?.lv) - 1 || 0]?.rate || 0) * 100)?.toFixed(0) : 0}%
            </b>{' '}
            &nbsp;
            <span>/tx</span>
          </div>
        </Space>

        <Hide if={isMaxLevel}>
          <Space className={styles.arrows} size={0}>
            <FontAwesomeIcon color="#9AA3A7" icon={faChevronRight} />
            <FontAwesomeIcon color="#9AA3A7" icon={faChevronRight} />
          </Space>

          <Space align="start" direction="vertical">
            <b className="bolder avenir">
              {t('referral.other.lvl_rate', { count: (Number(ranks?.lv) + 1 || 2) as any })}
            </b>
            <div className={styles.rateBox}>
              <b>
                {rewardTable ? Number(Number(rewardTable[Number(ranks?.lv) || 1]?.rate || 0) * 100)?.toFixed(0) : 0}%
              </b>{' '}
              &nbsp;
              <span>/tx</span>
            </div>
          </Space>
        </Hide>
      </div>
    </Surface>
  );
};

export default RewardRate;
