import React, { FC, useMemo } from 'react';
import styles from './RewardTable.module.less';

import { Empty, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { IRewardTable, useRewardTable } from 'api/referral';
import numeral from 'numeral';
import { useTypeSafeTranslation } from 'hooks';
import { Surface } from '@cross/ui';

const RewardTable: FC = () => {
  const { t } = useTypeSafeTranslation();
  const { data, isFetching } = useRewardTable();

  const columns = useMemo(() => {
    return [
      {
        title: 'Total Fees',
        dataIndex: 'min',
        render: (value) => (
          <div className="white">
            $ {numeral(value).format(`0,0[.][00000]`)} <span className="bold">USD +</span>
          </div>
        ),
      },
      {
        title: 'Reward',
        dataIndex: 'rate',
        render: (value) => (
          <div className="avenir light disabled-3">{value ? `${(Number(value) * 100).toFixed(2)} %` : '-'}</div>
        ),
      },
    ] as ColumnsType<IRewardTable>;
  }, [t]);

  return (
    <Surface className={styles.root}>
      <span className="bold">REWARD TABLE</span>

      {/* <TableContainer size="small" filled> */}
      <Table
        loading={isFetching}
        pagination={false}
        scroll={{ x: true }}
        size="small"
        rowKey="level"
        columns={columns}
        dataSource={data}
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No Data' />,
        }}
      />
      {/* </TableContainer> */}
    </Surface>
  );
};

export default RewardTable;
