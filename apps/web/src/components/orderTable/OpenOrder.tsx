import styles from './styles.module.less';
import { Button as ButtonAntd, Popconfirm, Space } from 'antd';
import dayjs from 'dayjs';
import { nDecimalFormatAdvance } from 'utils/number';
import { ColumnsType } from 'antd/lib/table';
import { currencyImgs } from 'assets/images/currency';
import {
  ORDER_LIMIT_PRICE,
  ORDER_NUMBER_GET,
  ORDER_PAIR_NAME,
  ORDER_PRICE,
  ORDER_TIME,
  ORDER_TOTAL,
  ORDER_TYPE,
} from './constant';
import BigNumber from 'bignumber.js';
import { TFunction } from 'next-i18next';
import { Avatar, Button } from '@cross/ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const columns = (
  t: TFunction,
  precisionsConfigs: any,
  onCancel: (orderId: any) => void,
  onCancelAll: () => void,
  canCancelAll: boolean
): ColumnsType<any> => [
  {
    title: 'Date',
    key: 'time',
    dataIndex: ORDER_TIME,
    sorter: (a: any, b: any) => a[ORDER_TIME] - b[ORDER_TIME],
    showSorterTooltip: false,
    render(value: any, _, index) {
      return <span id={`open-order-date-${index}`}>{dayjs(parseInt(value)).format('HH:mm:ss - DD/MM')}</span>;
    },
  },
  {
    title: 'Pair',
    key: 'pair',
    dataIndex: ORDER_PAIR_NAME,
    sorter: (a: any, b: any) => a[ORDER_PAIR_NAME].localeCompare(b[ORDER_PAIR_NAME]),
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
    key: 'orderType',
    dataIndex: ORDER_TYPE,
    render(type) {
      return <span>{type}</span>;
    },
  },
  {
    title: 'Side',
    key: 'side',
    dataIndex: ORDER_PRICE,
    render(side) {
      return <span className={side >= 0 ? 'positive' : 'negative'}>{side >= 0 ? 'Buy' : 'Sell'}</span>;
    },
  },
  {
    title: 'Stop Price',
    key: 'stopPrice',
    dataIndex: ORDER_LIMIT_PRICE,
    sorter: (a: any, b: any) => a[ORDER_LIMIT_PRICE] - b[ORDER_LIMIT_PRICE],
    showSorterTooltip: false,
    render(value, item) {
      const pairSplit = item?.pair?.split('_');
      return value === '0'
        ? '--'
        : nDecimalFormatAdvance(value, precisionsConfigs?.[item[1]]?.money ?? 8, { isAbsolute: true }) +
            (pairSplit ? ` ${pairSplit[1]}` : '');
    },
  },
  {
    title: 'Price',
    key: 'price',
    dataIndex: ORDER_PRICE,
    sorter: (a: any, b: any) => Math.abs(parseFloat(a[ORDER_PRICE])) - Math.abs(parseFloat(b[ORDER_PRICE])),
    showSorterTooltip: false,
    render(value, item) {
      const pairSplit = item?.pair?.split('_');
      return item?.[ORDER_TYPE] === 'MARKET'
        ? 'Market Price'
        : nDecimalFormatAdvance(value, precisionsConfigs?.[item[1]]?.money ?? 8, { isAbsolute: true }).split('-') +
            (pairSplit ? ` ${pairSplit[1]}` : '');
    },
  },
  {
    title: 'Amount',
    key: 'amount',
    dataIndex: ORDER_TOTAL,
    sorter: (a: any, b: any) => parseFloat(a[ORDER_TOTAL]) - parseFloat(b[ORDER_TOTAL]),
    showSorterTooltip: false,
    render(amount, item) {
      const pairSplit = item?.pair?.split('_');
      return (
        nDecimalFormatAdvance(amount, precisionsConfigs?.[item[1]]?.coin ?? 8, { isAbsolute: true }) +
        (pairSplit ? ` ${pairSplit[0]}` : '')
      );
    },
  },
  {
    title: 'Total',
    key: 'total',
    dataIndex: 7,
    sorter: (a: any, b: any) =>
      Math.abs(parseFloat(a[ORDER_PRICE])) * parseFloat(a[ORDER_TOTAL]) -
      Math.abs(parseFloat(b[ORDER_PRICE])) * parseFloat(b[ORDER_TOTAL]),
    showSorterTooltip: false,
    render(value, item: any) {
      const pairSplit = item?.[1]?.split('_');
      const price = new BigNumber(item[ORDER_PRICE]).abs();
      const amount = new BigNumber(item[ORDER_TOTAL]).abs();
      const total = price.multipliedBy(amount);
      return value === 'MARKET'
        ? 'Market Price'
        : nDecimalFormatAdvance(total.toNumber(), precisionsConfigs?.[item[1]]?.money ?? 8, { isAbsolute: true }) +
            (pairSplit ? ` ${pairSplit[1]}` : '');
    },
  },
  {
    title: 'Filled',
    key: 'tradeAmount',
    dataIndex: ORDER_NUMBER_GET,
    sorter: (a: any, b: any) =>
      (parseFloat(a[ORDER_NUMBER_GET]) / parseFloat(a[ORDER_TOTAL])) * 100 -
      (parseFloat(b[ORDER_NUMBER_GET]) / parseFloat(b[ORDER_TOTAL])) * 100,
    showSorterTooltip: false,
    align: 'center',
    render: (tradeAmount, record: any) => {
      const percent = (parseFloat(tradeAmount) / parseFloat(record[ORDER_TOTAL])) * 100;
      const background = `conic-gradient(
        var(--text-secondary) ${Math.ceil(percent)}%,
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
    title: (
      <Button disabled={canCancelAll} className={styles.btnCancel}>
        <Popconfirm title="Cancel All" onConfirm={onCancelAll} className={styles.popconfirm}>
          <span>Cancel All</span>
          <FontAwesomeIcon color="#788686" icon={faTimesCircle} />
        </Popconfirm>
      </Button>
    ),
    key: 'state',
    align: 'right',
    width: 105,
    render(record) {
      return (
        <ButtonAntd className="light" size="small" type="text">
          <Space align="center">
            <Popconfirm
              title="Are you want to cancel this order?"
              onConfirm={() => onCancel(record[0])}
              className={styles.popconfirm}
            >
              <span>Canceled</span>
              <FontAwesomeIcon color="#788686" icon={faTimes} />
            </Popconfirm>
          </Space>
        </ButtonAntd>
      );
    },
  },
];

export default columns;
