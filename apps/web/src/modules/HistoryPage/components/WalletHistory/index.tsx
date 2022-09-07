import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import styles from './styles.module.less';

import { Empty, message, Space, Table } from 'antd';
import {
  getWalletHistoryFile,
  historyCancelWithdrawRequest,
  historyWithdrawResendEmailRequest,
  useWalletHistory,
} from 'api/history';
import { getTableColumn } from './tableColumn';
import { Moment } from 'moment';
import { useMutation } from 'react-query';
import { useAppSelector, useTypeSafeTranslation } from 'hooks';
import { useWalletQuery } from 'api/wallet';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import clsx from 'clsx';
import { Button, DatePicker, Option, SelectWithLabel, Surface } from '@cross/ui';

const listType = [
  0, 3, 4, 10, 11, 12, 13, 16, 31, 36, 49, 54, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, -126,
];

interface FilterData {
  coin_type: string;
  type: number;
  startTime: Moment | null;
  endTime: Moment | null;
  page: number;
  sort?: 'desc' | 'asc' | '';
  columnSort?: string;
}

const PAGE_SIZE = 10;

const WalletHistory: FC = () => {
  const { t } = useTypeSafeTranslation();
  const [copy] = useCopyToClipboard();
  const currentSubAccount = useAppSelector((state) => state.subAccount.currentSubAccount);
  const language = useAppSelector((state) => state.system.language);
  const [filterData, setFilterData] = useState<FilterData>({
    coin_type: 'ALL',
    type: listType[0],
    startTime: null,
    endTime: null,
    page: 1,
    sort: '',
    columnSort: '',
  });

  const { mutate: exportFile, isLoading } = useMutation(getWalletHistoryFile, {
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const fileName = 'WalletHistory_Ultorex.csv';
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.download = fileName;
      a.href = URL.createObjectURL(blob);
      a.click();
    },
  });

  const { data: balance } = useWalletQuery({
    select: (data) => {
      return {
        ...data,
        coins: data.coins.filter((x) => x.coinType !== 'RIGHTS'),
      };
    },
  });

  const { data, isFetching, refetch } = useWalletHistory(
    {
      ...filterData,
      coin_type: filterData.coin_type === 'XCR (Locked)' ? 'XCR_BURN' : filterData.coin_type,
      page_size: PAGE_SIZE,
      startTime: filterData.startTime ? filterData.startTime.valueOf() : '',
      endTime: filterData.endTime ? filterData.endTime.valueOf() : '',
    },
    { staleTime: 0 } // Force refetch on every params change
  );

  const { mutate: resendEmail } = useMutation(historyWithdrawResendEmailRequest, {
    onSuccess: () => {
      refetch();
      message.success(t('historypage.wallethistory.resend_successfully'));
    },
  });
  const { mutate: withdrawCancel } = useMutation(historyCancelWithdrawRequest, {
    onSuccess: () => {
      refetch();
      message.success(t('common.successfull'));
    },
  });

  useEffect(() => {
    handleReset();
    refetch();
  }, [currentSubAccount]);

  const handleExport = async () => {
    const title = {
      title0: 'DateTime',
      title1: 'Coin',
      title2: 'Type',
      title3: 'Amount',
      title4: 'Tx ID',
      title5: 'Status',
    };
    const sendData = {
      utc: new Date().getTimezoneOffset(),
      typeStr: JSON.stringify({ all: 'ALL' }),
      title: encodeURIComponent(JSON.stringify(title)),
      statusStr: JSON.stringify({ status: '1', status1: '2' }),
      coinType: filterData.coin_type === 'XCR (Locked)' ? 'XCR_BURN' : filterData.coin_type,
      type: filterData.type,
      startTime: filterData.startTime ? new Date(filterData.startTime.valueOf()).getTime() : '',
      endTime: filterData.endTime ? new Date(filterData.endTime.valueOf()).setHours(23, 59, 59, 999) : '',
    };

    exportFile(sendData);
  };

  const handleResendEmail = (order_id: string) => {
    resendEmail({
      order_id,
      languageType: language === 'EN' ? 2 : 5,
    });
  };

  const handleWithdrawCancel = (order_id: string) => {
    withdrawCancel({ order_id });
  };

  const onChangeDateStart = (dateStart: any) => {
    let endTime = filterData.endTime;
    if (dateStart) {
      dateStart.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      if (endTime && dateStart > endTime) {
        endTime = null;
      }
    }
    setFilterData({
      ...filterData,
      page: 1,
      startTime: dateStart ?? undefined,
      endTime: endTime,
    });
  };

  const onChangeDateEnd = (dateEnd: any) => {
    let startTime = filterData.startTime;
    if (dateEnd) {
      dateEnd.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
      if (startTime && startTime > dateEnd) {
        startTime = null;
      }
    }
    setFilterData({
      ...filterData,
      page: 1,
      endTime: dateEnd ?? undefined,
      startTime: startTime,
    });
  };

  const columns = useMemo(() => {
    return getTableColumn(t, handleResendEmail, handleWithdrawCancel, copy);
  }, []);

  const getWalletType = useCallback((walletType) => {
    if (walletType === 16) return 112;
    if (walletType === 58) return 115;
    return walletType;
  }, []);

  const handleTableChange = useCallback(
    (pagination) => {
      // const order = sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : '';

      setFilterData({
        ...filterData,
        page: pagination.current,
        // columnSort: order ? sorter.columnKey : '',
        // sort: order,
      });
    },
    [filterData]
  );

  const handleReset = () => {
    setFilterData({ page: 1, coin_type: 'ALL', type: listType[0], startTime: null, endTime: null });
  };

  const dataSource = useMemo(() => {
    return data?.list?.map((item, index) => ({ ...item, id: index }));
  }, [data]);

  return (
    <div>
      <div className="f-end">
        <Button onClick={handleExport} loading={isLoading} className={styles.btnExport}>
          Export Wallet History
        </Button>
      </div>

      <div className={styles.filterWrapper}>
        <Space wrap size={12}>
          <DatePicker
            size="small"
            label="Start"
            placeholder=""
            onChange={onChangeDateStart}
            className={styles.input}
            value={filterData.startTime}
          />

          <DatePicker
            size="small"
            label="End"
            placeholder=""
            onChange={onChangeDateEnd}
            className={styles.input}
            value={filterData.endTime}
          />

          <SelectWithLabel
            size="small"
            label="Coin"
            onChange={(value) => {
              const coin = (balance as any)?.coins[value]?.coinType;

              setFilterData((old) => ({
                ...old,
                page: 1,
                coin_type: value === 'ALL' ? 'ALL' : coin === 'XCR_BURN' ? 'XCR (Locked)' : coin,
              }));
            }}
            value={filterData.coin_type}
            className={clsx(styles.input, styles.inputPair)}
            showSearch
            filterOption={(input, option) => {
              return (option?.children + '').toLowerCase().includes(input.toLowerCase());
            }}
          >
            <Option value="ALL">All</Option>
            {Object.keys(balance?.coins || []).map((item, index) => (
              <Option key={index} value={item}>
                {(balance?.coins as any)[item].coinType === 'XCR_BURN'
                  ? `XCR (${'Locked'})`
                  : (balance?.coins as any)[item].coinType}
              </Option>
            ))}
          </SelectWithLabel>

          <SelectWithLabel
            size="small"
            label="Type"
            onChange={(value: number) => {
              setFilterData((old) => ({ ...old, page: 1, type: value }));
            }}
            value={filterData.type}
            className={clsx(styles.input, styles.inputType)}
          >
            {listType.map((item, index) => (
              <Option key={`type-${index}`} value={item}>
                {/* {t(`historypage.wallethistory.type${getWalletType(item)}` as any)} */}
                All
              </Option>
            ))}
          </SelectWithLabel>

          <button onClick={handleReset} className={styles.btnReset}>
            <img src="/images/svgs/close.svg" alt="close-icon" />
          </button>
        </Space>
      </div>

      <Surface className={styles.tableWrapper}>
        <div className={styles.table}>
          <Table
            loading={isFetching}
            size="small"
            pagination={{
              hideOnSinglePage: true,
              pageSize: PAGE_SIZE,
              total: data?.page?.countNumber || 0,
              current: filterData.page,
              className: isFetching ? 'hidden' : '',
            }}
            onChange={handleTableChange}
            dataSource={isFetching ? [] : dataSource}
            columns={columns}
            rowKey="id"
            scroll={{ x: true }}
            locale={{
              emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" />,
            }}
          />
        </div>
      </Surface>
    </div>
  );
};

export default WalletHistory;
