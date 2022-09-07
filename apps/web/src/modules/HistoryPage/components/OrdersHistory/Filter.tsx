import React, { FC, useEffect } from 'react';
import styles from './Filter.module.less';

import { message, Space } from 'antd';

import { useAppDispatch, useAppSelector, useTypeSafeTranslation } from 'hooks';
import { getPages, PAGE_SIZE, setPages } from 'store/ducks/history/slice';
import { usePairListQuery } from 'api/pair_list';
import moment from 'moment';
import { useMutation } from 'react-query';
import { getOrderHistoryFile, getTradeHistoryFile } from 'api/history';
import { TError } from 'api/types';
import clsx from 'clsx';
import { Button, DatePicker, Option, SelectWithLabel } from '@cross/ui';

type FilterProps = {
  historyType: 'openOrders' | 'orderHistory' | 'tradeHistory';
};

const Filter: FC<FilterProps> = ({ historyType }) => {
  const { t } = useTypeSafeTranslation();

  const getFile = (data: any) => {
    if (data?.msg_code) {
      message.error(t(data.msg_code as any, { ns: 'error' }));
      return;
    }

    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const fileName = (historyType === 'orderHistory' ? 'Order' : 'Trade') + '_History_Ultorex.csv';
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.click();
  };

  const { mutate: exportTradeFile, isLoading: tradeLoading } = useMutation(getTradeHistoryFile, {
    onSuccess: (data) => {
      return getFile(data);
    },
    onError: (err: TError) => {
      message.error(t(err.msg_code as any, { ns: 'error' }));
      console.log(err);
    },
  });
  const { mutate: exportOrderFile, isLoading: orderLoading } = useMutation(getOrderHistoryFile, {
    onSuccess: (data) => {
      return getFile(data);
    },
    onError: (err: TError) => {
      message.error(t(err.msg_code as any, { ns: 'error' }));
      console.log(err);
    },
  });

  const dispatch = useAppDispatch();
  const filterData = useAppSelector(getPages);
  const { data: pairList } = usePairListQuery({ leverage: 'ALL' });

  const onSideChange = (side: 0 | 1 | 2) => {
    dispatch(setPages({ ...filterData, type: side }));
  };

  useEffect(() => {
    handleReset();
  }, [historyType]);

  const onChangeDateStart = (dateStart: any) => {
    let dateEnd = filterData.end_time;
    if (dateStart) {
      dateStart.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
      if (dateEnd && dateStart > dateEnd) {
        dateEnd = undefined;
      }
    }
    dispatch(
      setPages({
        ...filterData,
        page: 1,
        start_time: dateStart ? dateStart.valueOf() : 0,
        end_time: dateEnd,
      })
    );
  };

  const onChangeDateEnd = (dateEnd: any) => {
    let dateStart = filterData.start_time;
    if (dateEnd) {
      dateEnd.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
      if (dateStart && dateStart > dateEnd) {
        dateStart = undefined;
      }
    }

    dispatch(
      setPages({
        ...filterData,
        page: 1,
        end_time: dateEnd ? dateEnd.valueOf() : dateEnd,
        start_time: dateStart,
      })
    );
  };

  const onPairChange = (pair: string) => {
    dispatch(setPages({ ...filterData, page: 1, symbol: pair }));
  };

  const handleReset = () => {
    dispatch(
      setPages({
        symbol: '',
        type: 0,
        state: '',
        start_time: 0,
        end_time: 0,
        order_id: '',
        page: 1,
        page_size: PAGE_SIZE,
        sort: '',
        columnSort: '',
      })
    );
  };

  const handleExport = () => {
    if (historyType === 'orderHistory') {
      const title = {
        title0: 'Order ID',
        title1: 'Date',
        title2: 'Pair',
        title3: 'Type',
        title4: 'Side',
        title5: 'Stop Price',
        title6: 'Price',
        title7: 'Average Price',
        title8: 'Amount',
        title9: 'Total',
        title10: 'Filled',
        title11: 'Status',
      };
      exportOrderFile({
        utc: new Date().getTimezoneOffset(),
        title: encodeURIComponent(JSON.stringify(title)),
        start_time: filterData.start_time ? new Date(filterData.start_time.valueOf()).getTime() : '',
        end_time: filterData.end_time ? new Date(filterData.end_time.valueOf()).setHours(23, 59, 59, 999) : '',
        sellStr: JSON.stringify({ sell: 'Sell', buy: 'Buy' }),
        stateStr: JSON.stringify({
          status1: 'Start',
          status2: 'Partially Finished',
          status3: 'Finished',
          status4: 'Canceled',
          status_else: 'Processing',
        }),
        pair: filterData.symbol,
        order_type: filterData.type,
      });
    } else {
      const title: any = {
        title0: 'Order ID',
        title1: 'Date',
        title2: 'Pair',
        title3: 'Side',
        title4: 'Price',
        title5: 'Amount',
        title6: 'Total',
      };
      exportTradeFile({
        utc: new Date().getTimezoneOffset(),
        title: encodeURIComponent(JSON.stringify(title)),
        sellStr: JSON.stringify({ sell: 'Sell', buy: 'Buy' }),
        start_time: filterData.start_time ? new Date(filterData.start_time.valueOf()).getTime() : '',
        end_time: filterData.end_time ? new Date(filterData.end_time.valueOf()).setHours(23, 59, 59, 999) : '',
        pair: filterData.symbol,
        order_type: filterData.type,
      });
    }
  };

  if (historyType === 'openOrders') {
    return (
      <div className={styles.root}>
        <SelectWithLabel
          className={clsx(styles.input, styles.inputType)}
          size="small"
          label="Type"
          defaultValue={0}
          onChange={onSideChange}
          value={filterData.type}
        >
          <Option value={0}>All</Option>
          <Option value={1}>Buy</Option>
          <Option value={2}>Sell</Option>
        </SelectWithLabel>
      </div>
    );
  }

  return (
    <>
      <div className="f-end">
        <Button loading={tradeLoading || orderLoading} onClick={handleExport}>
          {historyType === 'orderHistory' ? 'Export Order History' : 'Export Trade History'}
        </Button>
      </div>
      <div className={styles.root}>
        <Space wrap size={12}>
          <Space>
            <DatePicker
              size="small"
              label="Start"
              placeholder=""
              onChange={onChangeDateStart}
              className={styles.input}
              value={filterData.end_time ? moment(filterData.start_time) : undefined}
            />
            <div className={styles.line} />
            <DatePicker
              size="small"
              label="End"
              placeholder=""
              onChange={onChangeDateEnd}
              className={styles.input}
              value={filterData.end_time ? moment(filterData.end_time) : undefined}
            />
          </Space>
          <SelectWithLabel
            size="small"
            label="Pair"
            onChange={onPairChange}
            value={filterData.symbol}
            className={clsx(styles.input, styles.inputPair)}
          >
            <Option value="">All</Option>
            {pairList.map((entry: any, position: number) => {
              return (
                <Option key={position} value={entry[0]}>
                  {entry[0]}
                </Option>
              );
            })}
          </SelectWithLabel>

          <SelectWithLabel
            className={clsx(styles.input, styles.inputType)}
            size="small"
            label="Type"
            defaultValue={0}
            onChange={onSideChange}
            value={filterData.type}
          >
            <Option value={0}>All</Option>
            <Option value={1}>Buy</Option>
            <Option value={2}>Sell</Option>
          </SelectWithLabel>

          <button onClick={handleReset} className={styles.btnReset}>
            <img src="/images/svgs/close.svg" alt="close-icon" />
          </button>
        </Space>
      </div>
    </>
  );
};

export default Filter;
