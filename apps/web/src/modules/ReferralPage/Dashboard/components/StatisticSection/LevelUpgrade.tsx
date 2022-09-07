import React, { FC, useMemo } from 'react';
import styles from './LevelUpgrade.module.less';

import { Empty, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ILevelSummaryTable, useLevelSummaryTable } from 'api/referral';
import numeral from 'numeral';
import { useTypeSafeTranslation } from 'hooks';
import { Surface } from '@cross/ui';

const LevelUpgrade: FC = () => {
  const { t } = useTypeSafeTranslation();
  const { data, isFetching } = useLevelSummaryTable();
  const columns = useMemo(() => {
    return [
      // {
      //   title: t('referral.other.level'),
      //   dataIndex: 'lv',
      //   render: (value) => <div className="white bold">LVL {value}</div>,
      // },
      {
        title: 'Fees',
        dataIndex: 'amount',
        render: (value) => (
          <div className="white">
            $ {numeral(value).format(`0,0[.][00000]`)} <span className="bold">USD +</span>
          </div>
        ),
      },
      {
        title: 'Referrals',
        dataIndex: 'user_count',
        align: 'center',
      },
      {
        title: `KYC's`,
        dataIndex: 'kyc_count',
        align: 'center',
      },
      {
        title: 'Qualified',
        dataIndex: 'qualified_count',
        align: 'center',
      },
    ] as ColumnsType<ILevelSummaryTable>;
  }, [t]);

  return (
    <Surface className={styles.root}>
      <span className="bold">LEVEL UPGRADES</span>

      {/* <TableContainer size="small" filled> */}
      <Table
        loading={isFetching}
        pagination={false}
        scroll={{ x: true }}
        size="small"
        columns={columns}
        dataSource={data?.slice(0, 1)}
        rowKey="lv"
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" />,
        }}
      />
      {/* </TableContainer> */}
    </Surface>
  );
};

export default LevelUpgrade;
