import { Empty, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { FC, useMemo } from 'react';
import styles from './SubAccountTable.module.less';

import { Button } from '@cross/ui';
import { SubAccountItem, useSubAccountsQuery } from 'api/sub_account';
import clsx from 'clsx';
import { useAppDispatch, useTypeSafeTranslation } from 'hooks';
import { setModalDelete, setModalEdit, setModalTransfer } from 'store/ducks/sub_account/slice';

const SubAccountTable: FC = () => {
  const { t } = useTypeSafeTranslation();
  const dispatch = useAppDispatch();
  const { data: subAccounts, isFetching } = useSubAccountsQuery();

  const columns = useMemo(() => {
    return [
      {
        title: 'Sub Account Name',
        sorter: (a: any, b: any, sortOrder: 'ascend' | 'descend' | boolean) => {
          let aName = a.nickName;
          let bName = b.nickName;
          if (!a.parentAccountId) aName = sortOrder === 'descend' ? '' : 'Z';
          if (!b.parentAccountId) aName = sortOrder === 'descend' ? '' : 'Z';
          return aName.localeCompare(bName);
        },
        showSorterTooltip: false,
        dataIndex: 'nickName',
        render: (value, record) => {
          return (
            <span className={clsx('disabled', styles.nickName)}>{record.parentAccountId ? value : 'Main Wallet'}</span>
          );
        },
      },
      {
        title: 'Balance',
        dataIndex: 'balance',
        render: () => {
          return <div className="white avenir">-</div>;
        },
      },
      {
        align: 'right',
        dataIndex: 'parentAccountId',
        render: (isSubAccount, record) => {
          return (
            <Space>
              <Button
                disabled={subAccounts?.length === 1}
                onClick={() => dispatch(setModalTransfer(record))}
                className={styles.btnTransfer}
                size="small"
              >
                Transfer
              </Button>
              <Button
                disabled={!isSubAccount}
                onClick={() => dispatch(setModalEdit(record))}
                type="primary"
                size="small"
              >
                Edit
              </Button>
              <Button disabled={!isSubAccount} onClick={() => dispatch(setModalDelete(record))} size="small">
                Delete
              </Button>
            </Space>
          );
        },
      },
    ] as ColumnsType<SubAccountItem>;
  }, [subAccounts, t]);

  return (
    <div className={styles.root}>
      <div className={styles.table}>
        <Table
          loading={isFetching}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          rowKey="accountId"
          columns={columns}
          scroll={{ x: true }}
          dataSource={subAccounts}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" /> }}
        />
      </div>
    </div>
  );
};

export default SubAccountTable;
