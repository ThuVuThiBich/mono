import { Space } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { THistoryData } from 'api/history';
import { currencyImgs } from 'assets/images/currency';
import { Avatar } from '@cross/ui';
import dayjs from 'dayjs';
import { TFunction } from 'next-i18next';
import { nDecimalFormatAdvance } from 'utils/number';

const columns = (t: TFunction, precisionsConfigs: any): ColumnsType<THistoryData> => [
  {
    title: 'Date',
    key: 'time',
    dataIndex: 'time',
    sorter: true,
    showSorterTooltip: false,
    render(value: any, _, index) {
      return <span id={`trade-history-date-${index}`}>{dayjs(parseInt(value)).format('HH:mm:ss - DD/MM')}</span>;
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
    title: 'Side',
    key: 'type',
    dataIndex: 'sell',
    render(side) {
      return <span className={!side ? 'positive' : 'negative'}>{side ? 'Sell' : 'Buy'}</span>;
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
    title: 'Amount',
    key: 'coin_number',
    dataIndex: 'amount',
    sorter: true,
    showSorterTooltip: false,
    render(amount, item: any) {
      const pairSplit = item?.pair?.split('_');
      return (
        nDecimalFormatAdvance(amount, precisionsConfigs?.[item.pair]?.coin ?? 8, { isAbsolute: true }) +
        (pairSplit ? ` ${pairSplit[0]}` : '')
      );
    },
  },
  {
    title: 'Total',
    key: 'money_number',
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
];

export default columns;
