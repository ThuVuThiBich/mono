import { Avatar, Button } from '@cross/ui';
import { Empty, Space, Table } from 'antd';
import Link from 'next/link';
import { FC } from 'react';
import { routes } from 'types/routes';
import styles from './StakingTable.module.less';

const StakingTable: FC = () => {
  const columns = [
    {
      render: () => {
        return (
          <Space>
            <Avatar className={styles.avatar} size={22} src={''} />
            <b className="white text-20 bold">SOL</b>
          </Space>
        );
      },
    },
    {
      render: () => {
        return (
          <Space align="center">
            <div className={styles.apyLabel}>APY</div>
            <div className={styles.apyBox} style={{ background: 'rgb(85, 97, 149)' }}>
              5% ~ 6%
            </div>
          </Space>
        );
      },
    },
    {
      render: () => {
        return (
          <Space size={0} direction="vertical">
            <span className="text-12 light disabled-4">Min:</span>
            <div className="avenir light disabled-3">
              <span>0.01</span>
              &nbsp;
              <span> SOL</span>
            </div>
          </Space>
        );
      },
    },
    {
      width: 100,
      render: () => {
        return (
          <Link href={routes.stake} passHref>
            <Button>Start Staking</Button>
          </Link>
        );
      },
    },
  ];

  const dataSource = [{ key: '1' }, { key: '2' }, { key: '3' }, { key: '4' }, { key: '5' }, { key: '6' }];

  return (
    <>
      <div className={styles.table}>
        <Table
          loading={false}
          pagination={{
            hideOnSinglePage: true,
          }}
          columns={columns}
          dataSource={dataSource}
          // rowKey={(x) => x}
          scroll={{ x: true }}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'No Data'} /> }}
        />
      </div>

      <div className="f-center">
        <Button onClick={() => {}}>List All</Button>
      </div>
    </>
  );
};

export default StakingTable;
