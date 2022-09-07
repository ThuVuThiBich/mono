import { IEarningHistoryParams } from 'api/referral';
import React, { FC, useState } from 'react';
import ContentTable from './components/ContentTable';
import Header from './components/Header';
import styles from './styles.module.less';

const Earning: FC = () => {
  const [filterData, setFilterData] = useState<IEarningHistoryParams>({
    page: 1,
    page_size: 10,
    start_time: '',
    end_time: '',
    type: '',
  });

  return (
    <div className={styles.root}>
      <Header filterData={filterData} setFilterData={setFilterData} />
      <ContentTable filterData={filterData} setFilterData={setFilterData} />
    </div>
  );
};

export default Earning;
