import { Avatar } from '@cross/ui';
import { Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { THistoryData } from 'api/history';
import { currencyImgs } from 'assets/images/currency';
import dayjs from 'dayjs';
import { TFunction } from 'next-i18next';
import { nDecimalFormatAdvance } from 'utils/number';
import styles from './styles.module.less';

const columns = (t: TFunction, precisionsConfigs: any): ColumnsType<THistoryData> => [
  {
    title: 'Date',
    key: 'order_time',
    dataIndex: 'time',
    sorter: true,
    showSorterTooltip: false,
    render(value: any, _, index) {
      return <span id={`order-history-date-${index}`}>{dayjs(parseInt(value)).format('HH:mm:ss - DD/MM')}</span>;
    },
  },
  {
    title: 'Pair',
    key: 'pair_name',
    dataIndex: 'pair',
    sorter: true,
    showSorterTooltip: false,
    render(pairStr) {
      const pairSplit = pairStr.split('_');
      return (
        <Space>
          <Space>
            <Avatar noBorder size={20} type="secondary" src={currencyImgs[pairSplit[0]] || currencyImgs.GENERIC} />
            <span className="bold default">{pairSplit[0]}</span>
          </Space>
          <span className="bold default">—</span>
          <Space>
            <Avatar noBorder size={20} type="secondary" src={currencyImgs[pairSplit[1]] || currencyImgs.GENERIC} />
            <span className="bold default">{pairSplit[1]}</span>
          </Space>
        </Space>
      );
    },
  },
  {
    title: 'Type',
    key: 'order_type',
    dataIndex: 'orderType',
    render(type) {
      return <span>{type}</span>;
    },
  },
  {
    title: 'Side',
    key: 'is_bid',
    dataIndex: 'sell',
    render(side) {
      return <span className={!side ? 'positive' : 'negative'}>{side ? 'Sell' : 'Buy'}</span>;
    },
  },
  {
    title: 'Stop Price',
    key: 'limitPrice',
    dataIndex: 'limitPrice',
    sorter: true,
    showSorterTooltip: false,
    render(value: any, item: any) {
      const pairSplit = item?.pair?.split('_');
      return value === '0'
        ? '--'
        : nDecimalFormatAdvance(value, precisionsConfigs?.[item.pair]?.money ?? 8, { isAbsolute: true }) +
            (pairSplit ? ` ${pairSplit[1]}` : '');
    },
  },
  {
    title: 'Price',
    key: 'price',
    dataIndex: 'price',
    sorter: true,
    showSorterTooltip: false,
    render(price, record: any) {
      const pairSplit = record?.pair?.split('_');
      return record.orderType === 'MARKET'
        ? 'Market Price'
        : nDecimalFormatAdvance(price, precisionsConfigs?.[record.pair]?.money ?? 8, { isAbsolute: true }) +
            (pairSplit ? ` ${pairSplit[1]}` : '');
    },
  },
  {
    title: 'Average Price',
    key: 'avg_price',
    dataIndex: 'avgPrice',
    sorter: true,
    showSorterTooltip: false,
    render(avgPrice, item: any) {
      const pairSplit = item?.pair?.split('_');
      return (
        nDecimalFormatAdvance(avgPrice, precisionsConfigs?.[item.pair]?.money ?? 8, {
          isAbsolute: true,
        }) + (pairSplit ? ` ${pairSplit[1]}` : '')
      );
    },
  },
  {
    title: 'Amount',
    key: 'total_number',
    dataIndex: 'amount',
    sorter: true,
    showSorterTooltip: false,
    render(amount, item: any) {
      const pairSplit = item?.pair?.split('_');
      return (
        nDecimalFormatAdvance(amount, precisionsConfigs?.[item.pair]?.coin ?? 8, {
          isNoZero: true,
          minPrecision: 2,
          isAbsolute: true,
        }) + (pairSplit ? ` ${pairSplit[0]}` : '')
      );
    },
  },
  {
    title: 'Total',
    key: 'money',
    dataIndex: 'total',
    sorter: true,
    showSorterTooltip: false,
    render(total, record: any) {
      const pairSplit = record?.pair?.split('_');
      return `${nDecimalFormatAdvance(total, precisionsConfigs?.[record.pair]?.money ?? 8, { isAbsolute: true })} ${
        pairSplit ? pairSplit[1] : ''
      }`;
    },
  },
  {
    title: 'Filled',
    key: 'number_get',
    dataIndex: 'tradeAmount',
    sorter: true,
    showSorterTooltip: false,
    align: 'center',
    render: (tradeAmount, record: any) => {
      const percent = (parseFloat(tradeAmount) / parseFloat(record.amount)) * 100;
      const background = `conic-gradient(
        #ffffff ${Math.ceil(percent)}%,
        #6A7980 ${Math.ceil(percent)}%
      )`;
      return (
        <div className="f-start">
          <div className={styles.filled} style={{ background }} />
          <div className="light">{percent.toFixed(2)} %</div>
        </div>
      );
    },
  },
  {
    title: 'Status',
    key: 'state',
    dataIndex: 'state',
    width: 105,
    render(state) {
      return (
        <div className="light">
          <Space align="center">{state === 3 ? 'Finished' : 'Canceled'}</Space>
        </div>
      );
    },
  },
];

export default columns;
