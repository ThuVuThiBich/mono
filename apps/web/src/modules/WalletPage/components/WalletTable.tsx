import { FC, useCallback, useState } from 'react';
import { Table, Typography, Space, Menu, Empty } from 'antd';
import styles from './WalletTable.module.less';
import { ColumnsType } from 'antd/lib/table';
import { WalletTableItem } from 'api/wallet/types';
import { usePairListQuery } from 'api/pair_list';
import { nDecimalFormat } from 'utils/number';
import { currencyImgs } from 'assets/images/currency';
import { DISABLE_COIN, NUMBER_ROUND, STABLE_COIN } from '../constants';
import { coinName } from 'utils/currency';
import { useRouter } from 'next/router';
import { routes } from 'types/routes';
import { useAppDispatch, useAppSelector } from 'hooks';
import { setAuthModal } from 'store/ducks/system/slice';
import { useGetUserInfo } from 'api/account';
import WithdrawModal from './Withdraw/WithdrawModal';
import DepositModal from './Deposit/DepositModal';
import { useCoinConvertList, useWalletQuery } from 'api/wallet';
import { setModalTransfer } from 'store/ducks/sub_account/slice';
import { getCurrentCurrency } from 'store/ducks/account/slice';
import clsx from 'clsx';
import ConvertModal from './ConvertModal';
import { useGetCreditCoins } from 'api/get_credit';
import { HIDE_COIN_WITHDRAW } from 'utils/config';
import { useSubAccountsQuery } from 'api/sub_account';
import { Avatar, Button, Dropdown } from '@cross/ui';

interface IModalData {
  type: 'deposit' | 'withdraw' | 'convert';
  selected?: string;
}

const WalletTable: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentCurrency = useAppSelector(getCurrentCurrency);
  const { data: wallets, isFetching } = useWalletQuery({
    select: (data) => {
      return { ...data, coins: data.coins.filter((x) => !STABLE_COIN.includes(x.coinType)) };
    },
  });
  const { data: pair_list } = usePairListQuery();
  const { data: userInfo } = useGetUserInfo({ refetchInterval: 10000, refetchOnWindowFocus: true });
  const { data: subAccounts } = useSubAccountsQuery();
  const [modal, setModal] = useState<IModalData>({
    type: 'withdraw',
    selected: undefined,
  });

  const { data: listConvertCoin } = useCoinConvertList();
  const { data: creditCoin } = useGetCreditCoins();

  const handleCloseModal = useCallback(() => {
    setModal({ type: 'withdraw', selected: undefined });
  }, []);

  const renderColumnCoin = (coin: string, index: number) => {
    const coinConvert = coin === 'XCR_BURN' ? `XCR (Locked)` : coin;
    return (
      <Space>
        <Space align="center">
          <Avatar type="secondary" src={currencyImgs[coin] || currencyImgs.GENERIC} size={22} />
          <Typography.Text id={`wallet-coin-${index}`} className="bold">
            {coinConvert}
          </Typography.Text>
        </Space>
        <Typography.Text className={styles.coinName}>{coinName[coin] ? coinName[coin] : coinConvert}</Typography.Text>
      </Space>
    );
  };
  const checkTradePair = (item: WalletTableItem) => {
    if (DISABLE_COIN.includes(item.coinType || '')) {
      return true;
    }
    return false;
  };

  const menu = (i: WalletTableItem) => {
    let list: any = [];
    pair_list?.forEach((item: any) => {
      const pair1 = item[0].split('_')[0];
      const pair2 = item[0].split('_')[1];
      if (
        (pair1 === i.coinType || pair2 === i.coinType) &&
        !DISABLE_COIN.includes(pair1) &&
        !DISABLE_COIN.includes(pair2)
      ) {
        list.push(item[0]);
      }
    });
    return (
      <Menu>
        {list.length > 0 ? (
          list.map((item: object, index: number) => (
            <Menu.Item
              key={index}
              onClick={() => {
                router.push(`${routes.exchange}/${item}`);
              }}
            >
              <span>{item} </span>
            </Menu.Item>
          ))
        ) : (
          <Menu.Item>
            <span>No Trading Market</span>
          </Menu.Item>
        )}
      </Menu>
    );
  };

  const renderActionColumn = (item: WalletTableItem) => {
    const isXCR = item.coinType.includes('XCR') || item.coinType === 'RIGHTS';
    const disableWithdraw = HIDE_COIN_WITHDRAW.includes(item.coinType);

    return (
      <Space align="center">
        <Button
          disabled={isXCR || item.rechargeGray === 1}
          className={clsx(styles.btnIcon, styles.btnXCR)}
          size="small"
          onClick={() => {
            setModal({ type: 'deposit', selected: item.coinType });
          }}
        >
          <img alt="deposit" src="/images/wallet/deposit.svg" />
        </Button>
        <Button
          disabled={isXCR || item.withdrawGray === 1 || disableWithdraw}
          className={clsx(styles.btnIcon, styles.btnXCR)}
          size="small"
          onClick={() => {
            if (userInfo?.use_mfa) {
              setModal({ type: 'withdraw', selected: item.coinType });
            } else {
              dispatch(setAuthModal('2fa'));
            }
          }}
        >
          <img alt="withdraw" src="/images/wallet/withdraw.svg" />
        </Button>

        <Button
          className={clsx(styles.btnIcon, {
            [styles.btnXCR]: isXCR,
          })}
          size="small"
          disabled={isXCR || listConvertCoin?.indexOf(item.coinType) === -1}
          onClick={() => {
            setModal({ type: 'convert', selected: item.coinType });
          }}
        >
          <img alt="convert" width={28} height={28} src="/images/wallet/convert.svg" />
        </Button>

        <Button
          className={clsx(styles.btnIcon, isXCR && styles.btnXCR)}
          size="small"
          disabled={subAccounts?.length === 1 || isXCR}
          onClick={() => dispatch(setModalTransfer({ coin: item.coinType }))}
        >
          <img alt="transfer" src="/images/wallet/transfer.svg" />
        </Button>

        <Button
          disabled={isXCR || !creditCoin?.includes(item.coinType)}
          type="primary"
          className={clsx(styles.btnBuy, isXCR && styles.btnXCR)}
          size="small"
          onClick={() => router.push(`${routes.buy}?coin=${item.coinType}`)}
        >
          Buy
        </Button>

        {isXCR ? (
          <Button
            type="primary"
            className={clsx(styles.btnTrade, isXCR && styles.btnXCR)}
            size="small"
            disabled={checkTradePair(item) || isXCR}
          >
            Trade
          </Button>
        ) : (
          <Dropdown overlay={menu(item)} className={styles.dropDown}>
            <div className={styles.dropdownWrapper}>
              <Button
                type="primary"
                className={clsx(styles.btnTrade, isXCR && styles.btnXCR)}
                size="small"
                disabled={checkTradePair(item) || isXCR}
              >
                Trade
              </Button>
            </div>
          </Dropdown>
        )}
      </Space>
    );
  };

  const columns: ColumnsType<WalletTableItem> = [
    {
      title: 'Coin',
      key: 'coinType',
      width: 250,
      sorter: (a: WalletTableItem, b: WalletTableItem) => a.coinType.localeCompare(b.coinType),
      showSorterTooltip: false,
      dataIndex: 'coinType',
      render(coin: string, _, index) {
        return renderColumnCoin(coin, index);
      },
    },
    {
      title: 'Total',
      key: 'totalNumber',
      dataIndex: 'totalNumber',
      sorter: (a: any, b: any) => a.totalNumber - b.totalNumber,
      showSorterTooltip: false,
      render(total: string, _, index) {
        return (
          <span id={`wallet-total-${index}`} className="avenir light">
            {nDecimalFormat(total, NUMBER_ROUND)}
          </span>
        );
      },
    },
    {
      title: 'In Use',
      key: 'lockNumber',
      sorter: (a: any, b: any) => a.lockNumber - b.lockNumber,
      showSorterTooltip: false,
      dataIndex: 'lockNumber',
      render(inuse: string) {
        return <span className="avenir light">{nDecimalFormat(inuse, NUMBER_ROUND)}</span>;
      },
    },
    {
      title: 'Available',
      key: 'number',
      sorter: (a: any, b: any) => a.number - b.number,
      showSorterTooltip: false,
      dataIndex: 'number',
      render(available: string, _, index) {
        return (
          <span id={`wallet-available-${index}`} className="avenir light">
            {nDecimalFormat(available, NUMBER_ROUND)}
          </span>
        );
      },
    },
    {
      title: 'Value',
      key: 'assessment',
      dataIndex: 'assessment',
      sorter: (a: any, b: any) => {
        if (a.coinType.includes('XCR') || a.coinType === 'RIGHTS') return -1;
        if (b.coinType.includes('XCR') || b.coinType === 'RIGHTS') return 1;
        return a.assessment - b.assessment;
      },
      showSorterTooltip: false,
      render(assessment: string, { coinType }) {
        const isXCR = coinType.includes('XCR') || coinType === 'RIGHTS';
        // if (coinType.includes('ORBS')) {
        //   const price = new BigNumber(totalNumber)
        //     .multipliedBy(orbsPrice?.price || 0)
        //     .multipliedBy(Number(currentCurrency.rate));
        //   return (
        //     <span className="avenir">
        //       {`${currentCurrency.symbol} ${nDecimalFormat(price.toString(), NUMBER_ROUND)}`}
        //     </span>
        //   );
        // }

        return (
          <span className="avenir">
            {isXCR
              ? '-'
              : `${currentCurrency.symbol} ${nDecimalFormat(
                  (Number(assessment) * Number(currentCurrency.rate)).toString(),
                  NUMBER_ROUND
                )}`}
          </span>
        );
      },
    },
    {
      width: 300,
      align: 'right',
      key: 'actions',
      render(item) {
        return renderActionColumn(item);
      },
    },
  ];

  return (
    <div className={styles.root}>
      <div className={styles.table}>
        <Table
          loading={isFetching}
          columns={columns}
          scroll={{ x: true }}
          dataSource={wallets?.coins}
          rowKey="coinType"
          pagination={false}
          size="small"
          locale={{
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'No Data'} />,
          }}
        />
      </div>

      {modal.type === 'withdraw' && !!modal.selected && (
        <WithdrawModal
          initCoin={modal.selected}
          visible={modal.type === 'withdraw' && !!modal.selected}
          onClose={handleCloseModal}
        />
      )}

      {modal.type === 'deposit' && !!modal.selected && (
        <DepositModal
          initCoin={modal.selected}
          visible={modal.type === 'deposit' && !!modal.selected}
          onClose={handleCloseModal}
        />
      )}

      {modal.type === 'convert' && !!modal.selected && (
        <ConvertModal
          initCoin={modal.selected}
          visible={modal.type === 'convert' && !!modal.selected}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default WalletTable;
