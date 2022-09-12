import { ColumnsType } from 'antd/lib/table';
import { IWalletHistory } from 'api/history';
import { TFunction } from 'next-i18next';
import dayjs from 'dayjs';
import { Space } from 'antd';
import { currencyImgs } from 'assets/images/currency';
import { getScanAddress } from './getScanAddress';
import numeral from 'numeral';
import { Avatar } from '@cross/ui';

type TOrderTypes = {
  [key: string]: string;
};

const orderTypes: TOrderTypes = {
  type10: 'Buy',
  type11: 'Sell',
  type12: 'Distribution payout',
  type13: 'Trading Fee',
  type31: 'Balance Adjustment',
};

export const getTableColumn = (
  t: TFunction,
  resendEmail: (orderId: string) => void,
  withdrawCancel: (orderId: string) => void,
  copy: (text: string) => void
): ColumnsType<IWalletHistory> => [
  {
    title: 'Date',
    key: 'mg_order_log_idex_time',
    dataIndex: 'time',
    // sorter: (a, b) => Number(a.number) - Number(b.number),
    showSorterTooltip: false,
    render(value: any) {
      return <span>{dayjs(parseInt(value)).format('HH:mm:ss - DD/MM')}</span>;
    },
  },
  {
    title: 'Coin',
    key: 'coin_type',
    dataIndex: 'coinType',
    sorter: (a, b) => Number(a.number) - Number(b.number),
    showSorterTooltip: false,
    render(coin) {
      return (
        <Space>
          <Avatar size={20} type="secondary" src={currencyImgs[coin] || currencyImgs.GENERIC} />
          <span className="bold default">{coin}</span>
        </Space>
      );
    },
  },
  {
    title: 'Type',
    key: 'orderType',
    dataIndex: 'orderType',
    render(value: string) {
      return <span> {orderTypes[`type${value}`]}</span>;
    },
  },
  {
    title: 'Amount',
    key: 'param1,value',
    dataIndex: 'number',
    // sorter: (a, b) => Number(a.number) - Number(b.number),
    showSorterTooltip: false,
    render(number) {
      const num = Number(number.substring(1));
      return (
        <span className={String(number).includes('+') ? 'success' : 'error'}>
          {/* deal with long decimal format */}
          {num < 0.001 ? number.substring(1) : numeral(num).format('0,0.[0000000000000000000]', Math.floor)}
        </span>
      );
    },
  },
  {
    title: 'Tx ID',
    key: 'txId',
    dataIndex: 'txId',
    ellipsis: true,
    render: (txId, record) => {
      if (!txId) return '';
      const length = txId.length;
      let scanUrl = getScanAddress(record?.chain, txId);

      if (record.chain === 'xtz') {
        scanUrl = getScanAddress(record?.chain, txId.split('|')[0]);
      }
      return (
        <Space>
          <a href={scanUrl} target="_blank" rel="noopener noreferrer">
            {txId?.slice(0, 5)}...{txId?.slice(length - 4, length)}
          </a>
          <a onClick={() => copy(txId as string)}>
            <img width="13px" src="/images/svgs/copy-duotone.svg" alt="cpy" />
          </a>
        </Space>
      );
    },
  },
  {
    title: 'Status',
    key: 'status',
    dataIndex: 'status',
    render(_, record) {
      const status = record.detail ? record?.detail?.status : record.status;

      if (Number(status) === 1) {
        if (record.orderType === 4) {
          return 'Create';
        } else {
          return 'Waiting deposit';
        }
      }

      if (Number(status) === 2) {
        if (record.orderType === 4) {
          return 'Sent';
        } else {
          return 'Done';
        }
      }

      return t(`historypage.wallethistory.withdraw_s${status}`);
    },
  },
  {
    title: 'Action',
    key: 'status',
    dataIndex: 'status',
    render() {
      // const status = record.detail ? record.detail.status : record.status;
      // if (
      //   Number.isInteger(status) &&
      //   parseFloat(status) === 1 &&
      //   Number.isInteger(record.orderType) &&
      //   Number(record.orderType) === 4
      // ) {
      //   return (
      //     <Space>
      //       <Button size="small" type="info" onClick={() => resendEmail(record.orderId)}>
      //         Resend
      //       </Button>
      //       <Button size="small" type="sell" onClick={() => withdrawCancel(record.orderId)}>
      //         Cancel
      //       </Button>
      //     </Space>
      //   );
      // }
      return '';
    },
  },
];
