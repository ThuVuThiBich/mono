import React, { FC, useCallback, useMemo } from 'react';
import styles from './styles.module.less';
import Dashboard from './Dashboard';
import Earning from './Earning';
import Referrals from './Referrals';
import { useRouter } from 'next/router';
import { useTypeSafeTranslation } from 'hooks';
import { MainLayout } from 'components/mainLayout';
import { FilterGroup } from '@cross/ui';

const ReferralPage: FC = () => {
  const { t } = useTypeSafeTranslation();
  const router = useRouter();

  const { tab } = router.query;

  const handleTabChange = useCallback((e) => {
    router.replace(`${router.pathname}?tab=${e.target.value}`, undefined, {
      shallow: true,
    });
  }, []);

  const tabDatas = useMemo(() => {
    return [
      { label: 'Referral Dashboard', value: 'dashboard', title: 'Referral Dashboard' },
      { label: 'Your Earnings', value: 'earnings', title: 'Your Earnings' },
      { label: 'Your Referrals', value: 'referrals', title: 'Your Referrals' },
      // { label: t('referral.tab.banners'), value: 'banners', title: t('referral.tab.banners_title') },
    ];
  }, [t]);

  const title = useMemo(() => {
    return tabDatas.find((x) => x.value === tab)?.title || tabDatas[0].title;
  }, [tab, tabDatas]);

  return (
    <MainLayout>
      <div className={styles.header}>
        <h1>{title}</h1>
        <FilterGroup filled datas={tabDatas} value={tab || tabDatas[0].value} onChange={handleTabChange} />
      </div>

      {(!tab || tab === 'dashboard') && <Dashboard />}
      {tab === 'earnings' && <Earning />}
      {tab === 'referrals' && <Referrals />}
      {/* {tab === 'banners' && <Banners />} */}
    </MainLayout>
  );
};

export default ReferralPage;
