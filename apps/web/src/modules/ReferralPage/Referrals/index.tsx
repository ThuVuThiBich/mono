import React, { FC, useState } from 'react';
import styles from './styles.module.less';
import Header from './components/Header';
import ContentTable from './components/ContentTable';
import { IReferralHistoryParams } from 'api/referral';

const Referrals: FC = () => {
  const [filterData, setFilterData] = useState<IReferralHistoryParams>({
    page: 1,
    page_size: 10,
    startDate: '',
    endDate: '',
  });

  return (
    <div className={styles.root}>
      <Header filterData={filterData} setFilterData={setFilterData} />
      <ContentTable filterData={filterData} setFilterData={setFilterData} />
    </div>
  );
};

export default Referrals;
