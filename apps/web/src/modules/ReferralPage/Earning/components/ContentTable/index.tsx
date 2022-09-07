import { FC, useEffect, useMemo, useState } from 'react';
import styles from './styles.module.less';
import { Col, Empty, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { IEarningHistoryParams, IEarningReferral, useEarningReferralHistory } from 'api/referral';
import dayjs from 'dayjs';
import { useAppSelector, useTypeSafeTranslation } from 'hooks';
import { formatNumberFixed } from 'utils/number';
import { getCurrentSubAccount } from 'store/ducks/sub_account/slice';
import { useSubAccountsQuery } from 'api/sub_account';
import clsx from 'clsx';
import { FilterGroup, Surface } from '@cross/ui';

interface ContentTableProps {
  filterData: IEarningHistoryParams;
  setFilterData: React.Dispatch<React.SetStateAction<IEarningHistoryParams>>;
}

const ContentTable: FC<ContentTableProps> = ({ filterData, setFilterData }) => {
  const { t } = useTypeSafeTranslation();
  const [nickname, setNickname] = useState<string>('');
  const { data, isFetching, refetch } = useEarningReferralHistory({
    ...filterData,
    start_time: filterData.start_time ? filterData.start_time.valueOf() : '',
    end_time: filterData.end_time ? filterData.end_time.valueOf() : '',
  });

  const currentSubAccount = useAppSelector(getCurrentSubAccount);

  const { data: subAccountData, isLoading: loadingSubAccount } = useSubAccountsQuery({});

  const setCurrentNickname = () => {
    const mainAccount = subAccountData?.find((acc) => !acc.parentAccountId);
    setNickname(mainAccount?.nickName || '');
  };

  useEffect(() => {
    refetch();
    setCurrentNickname();
  }, [currentSubAccount]);

  const columns = useMemo(() => {
    return [
      {
        title: 'Your Reward',
        key: 'number',
        sorter: (a, b) => Number(a.number) - Number(b.number),
        showSorterTooltip: false,
        dataIndex: 'number',
        render: (value, record) => (
          <span className="white">
            {formatNumberFixed(value)} <b>{record.coinName}</b>
          </span>
        ),
      },
      {
        title: 'Reward Rate',
        key: 'rewardRate',
        sorter: (a, b) => Number(a.rewardRate) - Number(b.rewardRate),
        showSorterTooltip: false,
        render: ({ rewardRate, referralName }) => {
          return (
            <span className="disabled-3">
              {referralName?.includes(nickname) ? '-' : `${(Number(rewardRate || 0) * 100).toFixed(2)}%`}
              {/* {typeof referralName} */}
            </span>
          );
        },
      },
      {
        title: 'User',
        key: 'referralName',
        sorter: (a, b) => a.referralName.localeCompare(b.referralName),
        showSorterTooltip: false,
        dataIndex: 'referralName',
        render(referralName) {
          return <span className="white">{referralName}</span>;
        },
      },
      {
        title: 'Date',
        key: 'time',
        sorter: (a, b) => Number(a.time) - Number(b.time),
        showSorterTooltip: false,
        dataIndex: 'time',
        render: (value) => <span className="disabled-3">{dayjs(Number(value)).format('HH:mm:ss - DD/MM/YYYY')}</span>,
      },
    ] as ColumnsType<IEarningReferral>;
  }, [t]);

  const tabDatas = useMemo(() => {
    return [
      { label: 'Spot Trade', value: 'spot_trade' },
      {
        label: <span className="disabled not-allowed">Leverage Trade</span>,
        value: 'leverage_trade',
      },
    ];
  }, [t]);

  return (
    <Surface className={styles.contentWrapper}>
      <div className={styles.contentHeader}>
        <Row gutter={[16, 16]} align="bottom">
          <Col flex={'auto'}>
            <div className={styles.contentTitle}>TRX HISTORY</div>
          </Col>
          <Col>
            <FilterGroup filled datas={tabDatas} value={tabDatas?.[0].value} />
            <img className={styles.contentSymbol} src="/images/svgs/exchange-duotone.svg" alt="" />
          </Col>
        </Row>
      </div>
      <div className={styles.table}>
        <Table
          loading={isFetching || loadingSubAccount}
          size="small"
          dataSource={data?.referralRewardList}
          columns={columns}
          rowKey="id"
          scroll={{ x: true }}
          pagination={false}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" /> }}
        />
      </div>
      {/* <div className={styles.pagination}>
        <PaginationForm
          // hideOnSinglePage={Number(data?.pageInfo.countPage) <= 1}
          className={clsx({
            [styles.hidePagination]: Number(data?.pageInfo.countNumber) < 10,
            [styles.hideOptionPagination]: Number(data?.pageInfo.countPage) === 1,
          })}
          pageSize={filterData.page_size}
          current={filterData.page}
          total={data?.pageInfo.countNumber}
          showSizeChanger
          onChange={(page, pageSize) => {
            setFilterData((old) => ({ ...old, page, page_size: pageSize }));
          }}
        />
      </div> */}
    </Surface>
  );
};

export default ContentTable;
