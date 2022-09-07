import { FC, useEffect, useMemo, useState } from 'react';
import styles from './styles.module.less';
import { Col, Row, Table, Avatar, Space, Empty } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { IReferralHistoryParams, IReferralInvitation, useReferralInvitation } from 'api/referral';
import dayjs from 'dayjs';
import { STATUS_ICON } from 'modules/ReferralPage/Dashboard/components/YourInvitation';
import { useAppSelector, useTypeSafeTranslation } from 'hooks';
import { getCurrentSubAccount } from 'store/ducks/sub_account/slice';
import clsx from 'clsx';
import { Surface } from '@cross/ui';

interface ContentTableProps {
  filterData: IReferralHistoryParams;
  setFilterData: React.Dispatch<React.SetStateAction<IReferralHistoryParams>>;
}

const formatDate = (value: any) => {
  if (value === '0') return '-';

  return dayjs(Number(value)).format('HH:mm - DD/MM/YY');
};

const ContentTable: FC<ContentTableProps> = ({ filterData }) => {
  const { t } = useTypeSafeTranslation();

  const [pageSize, setPageSize] = useState(10);
  const { data, isFetching, refetch } = useReferralInvitation();

  const currentSubAccount = useAppSelector(getCurrentSubAccount);

  useEffect(() => {
    refetch();
  }, [currentSubAccount]);

  const columns = useMemo(() => {
    return [
      {
        title: 'Name',
        dataIndex: 'nickname',
        sorter: (a, b) => a.nickname.localeCompare(b.nickname),
        showSorterTooltip: false,
        render: (value) => <span className="text-12">{value}</span>,
      },
      {
        title: 'Registration date',
        dataIndex: 'registerDate',
        sorter: (a, b) => Number(a.registerDate) - Number(b.registerDate),
        showSorterTooltip: false,
        render: (value) => <span className="text-12 disabled-3">{formatDate(value)}</span>,
      },
      {
        title: 'KYC date',
        dataIndex: 'kycDate',
        sorter: (a, b) => Number(a.kycDate) - Number(b.kycDate),
        showSorterTooltip: false,
        render: (value) => <span className="text-12 disabled-3">{formatDate(value)}</span>,
      },
      {
        title: 'First trade date',
        dataIndex: 'firstTrade',
        sorter: (a, b) => Number(a.firstTrade) - Number(b.firstTrade),
        showSorterTooltip: false,
        render: (value) => <span className="text-12 disabled-3">{formatDate(value)}</span>,
      },
      {
        title: 'Last trade date',
        dataIndex: 'lastTrade',
        sorter: (a, b) => Number(a.lastTrade) - Number(b.lastTrade),
        showSorterTooltip: false,
        render: (value) => <span className="text-12 disabled-3">{formatDate(value)}</span>,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        sorter: (a, b) => b.status.localeCompare(a.status),
        showSorterTooltip: false,
        render: (value) => (
          <Space>
            <Avatar size={20} src={STATUS_ICON[value] || STATUS_ICON.REGISTRATION_ONLY} />
            <span className={styles[value]}>{t(('referral.status.' + value) as any)}</span>
          </Space>
        ),
      },
    ] as ColumnsType<IReferralInvitation>;
  }, [t]);

  const dataSource = useMemo(() => {
    if (!data || !data.referrals) return [];
    // Filter data
    let nReferrals = [...data.referrals];
    const startDate = filterData.startDate ? filterData.startDate.valueOf() : '';
    const endDate = filterData.endDate ? filterData.endDate.valueOf() : '';

    if (startDate) {
      nReferrals = nReferrals.filter((x) => {
        if (x.registerDate !== '0' && dayjs(Number(x.registerDate)).isBefore(startDate)) return false;
        if (x.kycDate !== '0' && dayjs(Number(x.kycDate)).isBefore(startDate)) return false;
        if (x.lastTrade !== '0' && dayjs(Number(x.lastTrade)).isBefore(startDate)) return false;
        if (x.firstTrade !== '0' && dayjs(Number(x.firstTrade)).isBefore(startDate)) return false;
        return true;
      });
    }
    if (endDate) {
      nReferrals = nReferrals.filter((x) => {
        if (x.registerDate !== '0' && dayjs(Number(x.registerDate)).isAfter(endDate)) return false;
        if (x.kycDate !== '0' && dayjs(Number(x.kycDate)).isAfter(endDate)) return false;
        if (x.lastTrade !== '0' && dayjs(Number(x.lastTrade)).isAfter(endDate)) return false;
        if (x.firstTrade !== '0' && dayjs(Number(x.firstTrade)).isAfter(endDate)) return false;
        return true;
      });
    }

    if (filterData?.status) {
      nReferrals = nReferrals.filter((x) => x.status === filterData.status);
    }

    return nReferrals;
  }, [data, filterData]);

  return (
    <Surface className={styles.contentWrapper}>
      <div className={styles.contentHeader}>
        <Row gutter={[16, 16]} align="bottom">
          <Col flex={'auto'}>
            <div className={styles.contentTitle}>REFERRALS LIST</div>
          </Col>
        </Row>
      </div>
      <div className={styles.table}>
        <Table
          loading={isFetching}
          size="small"
          dataSource={dataSource}
          columns={columns}
          rowKey="accountId"
          scroll={{ x: true }}
          pagination={{
            className: clsx(styles.pagination, {
              [styles.hidePagination]: Number(data?.referrals?.length) < 10,
              [styles.hideOptionPagination]:
                Number(data?.referrals?.length) < pageSize &&
                parseInt((Number(data?.referrals?.length) / pageSize).toString()) <= 1,
            }),
            defaultPageSize: 10,
            showSizeChanger: true,
            onShowSizeChange: (cur, size) => {
              setPageSize(size);
            },
          }}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" /> }}
        />
      </div>
      {/* 
      <div className={styles.pagination}>
        <PaginationForm
          hideOnSinglePage
          pageSize={filterData.page_size}
          current={filterData.page}
          total={data?.totalRecord}
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
