import React, { FC, useEffect, useMemo } from 'react';
import styles from './YourEarning.module.less';

import { Col, Divider, Empty, Row, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import Link from 'next/link';
import { ReferralTab, routes } from 'types/routes';
import { IEarningReferral, useEarningReferralHistory } from 'api/referral';
import dayjs from 'dayjs';
import { useAppSelector, useTypeSafeTranslation } from 'hooks';
import { getCurrentCurrency } from 'store/ducks/account/slice';
import { formatNumber, formatNumberFixed } from 'utils/number';
import { getCurrentSubAccount } from 'store/ducks/sub_account/slice';
import { Surface } from '@cross/ui';

const YourEarning: FC = () => {
  const { t } = useTypeSafeTranslation();
  const {
    data: referralHistory,
    isFetching: loadingTable,
    refetch,
  } = useEarningReferralHistory({ page: 1, page_size: 10 });
  const currency = useAppSelector(getCurrentCurrency);
  const currentSubAccount = useAppSelector(getCurrentSubAccount);

  useEffect(() => {
    refetch();
  }, [currentSubAccount]);

  const columns = useMemo(() => {
    return [
      {
        title: 'Your Reward',
        dataIndex: 'number',
        render: (value, record) => (
          <span className="text-12">
            {formatNumberFixed(value)} {record.coinName}
          </span>
        ),
      },
      {
        title: 'Name',
        dataIndex: 'referralName',
        render: (value) => <span className="text-12">{value}</span>,
      },
      {
        title: 'Date',
        dataIndex: 'time',
        render: (value) => (
          <span className="text-12 disabled-3">{dayjs(Number(value)).format('HH:mm - DD/MM/YY')}</span>
        ),
      },
    ] as ColumnsType<IEarningReferral>;
  }, [t]);

  return (
    <Surface className={styles.root}>
      <span className="bold">YOUR EARNINGS</span>
      <Divider className="m-0" />

      <Row className={styles.body} justify="space-between" align="top" gutter={[16, 16]}>
        <Col xs={24} sm={15}>
          <div className="disabled-3">Total Earnings:</div>
          <Space size={0} direction="vertical" align="end">
            <div className={styles.lockedBalance}>
              {formatNumber(Number(referralHistory?.totalEarningBTC), 8)} <span>BTC</span>
            </div>
            <div className={styles.lockedBalanceExchange}>
              ~{currency.symbol} {formatNumber(Number(referralHistory?.totalEarning) * Number(currency.rate), 2)}{' '}
              {currency.coinType}
            </div>
          </Space>
        </Col>
        <Col xs={24} sm={9}>
          {/* <ReferralEarningPnl
            percent={referralHistory?.pnl?.percent || 0}
            assetYesterday={referralHistory?.pnl?.assetYesterday || 0}
          /> */}
        </Col>

        <Col span={24}>
          {/* <TableContainer className={styles.table} size="small" filled> */}
          <Table
            loading={loadingTable}
            rowKey="id"
            size="small"
            scroll={{ x: true }}
            columns={columns}
            dataSource={referralHistory?.referralRewardList.map((x, id) => ({ ...x, id }))}
            pagination={false}
            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" /> }}
          />
          {/* </TableContainer> */}
        </Col>
      </Row>

      <div className="f-end">
        {Number(referralHistory?.pageInfo?.countPage) > 1 && (
          <Link href={`${routes.referral}?tab=${ReferralTab.earnings}`}>
            <a className="white">
              {t('common.see_all')} &nbsp;
              <img src="/images/svgs/arrow-from-bottom-solid.svg" alt="icon" />
            </a>
          </Link>
        )}
      </div>
    </Surface>
  );
};

export default YourEarning;
