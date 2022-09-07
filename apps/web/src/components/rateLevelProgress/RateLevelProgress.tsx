import React, { FC, useMemo } from 'react';
import styles from './RateLevelProgress.module.less';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Space } from 'antd';
import { useReferralRank } from 'api/dashboard';
import numeral from 'numeral';
import { useUser } from '@auth0/nextjs-auth0';
import clsx from 'clsx';
import { useSubAccountsQuery } from 'api/sub_account';
import { useTypeSafeTranslation } from 'hooks';
import { Surface } from '@cross/ui';

interface RateLevelProgressProps {
  percent?: number;
  level?: number;
  label?: string;
}

const RateLevelProgress: FC<RateLevelProgressProps> = () => {
  const { t } = useTypeSafeTranslation();
  const { user } = useUser();
  const { data } = useReferralRank();
  const { data: subAccounts } = useSubAccountsQuery();

  const nickName = useMemo(() => {
    if (!subAccounts) return 'User';

    const mainAccount = subAccounts.find((x) => !x.parentAccountId);
    return mainAccount?.nickName || user?.nickname;
  }, [subAccounts]);

  const isMaxLevel = useMemo(() => {
    if (!data) return false;
    return Number(data.lv) === 7;
  }, [data]);

  const percent = useMemo(() => {
    if (!data) return 0;
    if (isMaxLevel) {
      return 100;
    }
    return Math.min((Number(data.amount) * 100) / Number(data.max), 100);
  }, [data]);

  return (
    <Surface filled className={styles.root}>
      <div className={styles.header}>
        <img src="/images/svgs/crown.svg" alt="crown" />
        <p className="m-0 text-16">{nickName || t('common.user')}</p>
        <h1 className="primary m-0 text-22 bolder avenir">LVL {data?.lv ?? 1}</h1>
      </div>

      <div className={styles.progress}>
        <div
          className={clsx(styles.bar, {
            [styles.bar_0]: percent < 3,
            [styles.bar_min_8]:
              (percent <= 8 && percent > 0) || (data?.amount !== '0.00000000' && (data?.amount || '')?.length > 6),
            [styles.bar_max]: percent > 85,
          })}
          style={{ width: `${percent}%` }}
        >
          <div className={styles.handler}>
            <span>
              <span className="medium">$ </span>
              {Number(data?.amount) === 0 ? 0 : numeral(data?.amount).format('0,0.00000000')}{' '}
              <span className="medium">USD</span>
            </span>
            <img src="/images/svgs/handler.svg" alt="handler" />
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        {!isMaxLevel && (
          <Space size={0}>
            <FontAwesomeIcon size="xs" icon={faChevronRight} color="#9AA3A7" />
            <FontAwesomeIcon size="xs" icon={faChevronRight} color="#9AA3A7" />
          </Space>
        )}
        <b>&nbsp;LVL {Math.min(Number(data?.lv ?? 0) + 1, 7)}</b>
      </div>
    </Surface>
  );
};

export default RateLevelProgress;
