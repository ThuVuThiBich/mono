import React, { FC, useEffect, useMemo } from 'react';
import styles from './EarningTable.module.less';
import { Table, Space, Tag, Tooltip, Empty } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ILockerOrder, useAutoCompoundFlag, useLockedAmount } from 'api/staking';
import { currencyImgs } from 'assets/images/currency';

import { currencyColors } from 'assets/images/currencyColors';
import UnstakeModal from './UnstakeModal';
import { useAppDispatch, useAppSelector, useTypeSafeTranslation } from 'hooks';
import { setRedeemModal, setUnstakeModal } from 'store/ducks/stake/slice';
import dayjs from 'dayjs';
import { getCurrentSubAccount } from 'store/ducks/sub_account/slice';
import { formatNumberFixed } from 'utils/number';
import BigNumber from 'bignumber.js';
import { useWalletQuery } from 'api/wallet';
import RedeemModal from './RedeemModal';
import SyncAlt from 'assets/svgs/components/SyncAlt';
import { APY_STAKING_RANGE } from 'utils/config';
import { Avatar, Button } from '@cross/ui';

BigNumber.config({ EXPONENTIAL_AT: 1e9 });

const COIN_CAN_NOT_UNSTAKED = ['ETH', 'AVAX', 'IOTX'];
const COIN_CALCULATE_REWARD = ['ADA', 'SOL', 'AVAX', 'IOTX'];
const COIN_COMPOUNDING = ['ETH', 'AVAX', 'IOTX'];
const COIN_MULTIPLE_SEVEN = ['ATOM'];

const STAKE_TYPES: Record<string, string> = {
  3: 'Staking',
  2999: 'Staking',
  2003: 'Earn 30',
  2002: 'Earn 60',
  2001: 'Earn 90',
};

const EARNING_REDEEM_DAY: Record<number, number> = {
  3: 0,
  2999: 0,
  2003: 30,
  2002: 60,
  2001: 90,
};

const STATUS: any = {
  1: {
    label: 'ACTIVE',
    color: '#12CEA3',
  },
  pending: {
    label: 'PENDING',
    color: '#9AA3A7',
  },
  unstaking: '#FF557C',
  2: {
    label: 'CANCELING',
    color: '#FF557C',
  },
  4: {
    label: 'COMPLETED',
    color: '#FFBA00',
  },
};

const EarningTable: FC = () => {
  const { t } = useTypeSafeTranslation();
  const dispatch = useAppDispatch();
  const currencySubAccount = useAppSelector(getCurrentSubAccount);
  const { data: wallet } = useWalletQuery();
  const {
    data: lockedInfo,
    isFetching: lockedInfoLoading,
    refetch,
  } = useLockedAmount({
    select: (data) => {
      return {
        ...data,
        lockOrders: data.lockOrders.map((item, i) => ({ ...item, id: i })),
      };
    },
  });

  const { data: autoCompoundConfig } = useAutoCompoundFlag();

  useEffect(() => {
    refetch();
  }, [currencySubAccount]);

  const columns = useMemo(() => {
    return [
      {
        title: 'Token & Plan',
        dataIndex: 'type',
        sorter: (a, b) => {
          return a.coinName.localeCompare(b.coinName);
        },
        showSorterTooltip: false,
        render: (value, record) => {
          const name = value === 2999 ? 'XCRS' : record.coinName;

          const isStakingORBS = record.type === 3 && record.coinName === 'ORBS';

          return (
            <Space size={12}>
              <Avatar size={20} type="secondary" src={currencyImgs[record.coinName] || currencyImgs.GENERIC} />
              <span className="white bold">{name}</span>
              <span className="disabled">
                {STAKE_TYPES[value] || STAKE_TYPES['3']}
                {isStakingORBS && autoCompoundConfig && autoCompoundConfig['ORBS'] && (
                  <Tooltip title={t('stake.reward_is_auto_compounded_every_monday')}>
                    &emsp;
                    <SyncAlt />
                  </Tooltip>
                )}
              </span>
            </Space>
          );
        },
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render: (val) => {
          return (
            <Tag className={styles.status} color={STATUS[val].color || STATUS[1].color}>
              {STATUS[val].label || STATUS[1].label}
            </Tag>
          );
        },
      },
      {
        title: 'Locked',
        dataIndex: 'number',
        sorter: (a, b) => {
          return Number(a.number) - Number(b.number);
        },
        showSorterTooltip: false,
        render: (value, record) => {
          const isXCRS = record.type === 2999;

          if (isXCRS) {
            const XCRSBalance = wallet?.coins?.find((x) => x.coinType === 'XCRS')?.totalNumber;

            return (
              <div className={styles.xcrsLocked}>
                <span>
                  <b className="bolder text-12 white avenir">{formatNumberFixed(XCRSBalance) || '--'}</b>&nbsp;
                  <span className="disabled-4 text-12">XCRS</span>
                </span>

                <span>
                  <b className="bolder text-12 white avenir">{formatNumberFixed(value)}</b>&nbsp;
                  <span className="disabled-4 text-12">{record.coinName}</span>
                </span>
              </div>
            );
          }

          return (
            <span>
              <b className="bolder white avenir">{formatNumberFixed(value)}</b>&nbsp;
              <span className="disabled-4">{record.coinName}</span>
            </span>
          );
        },
      },
      {
        title: 'Est. APY/APR',
        // sorter: (a, b) => {
        //   return Number(a.apy) - Number(b.apy);
        // },
        showSorterTooltip: false,
        dataIndex: 'apy',
        render: (value, record) => {
          const isStake = record.type === 3 || record.type === 2999;

          return (
            <div className={styles.apyBox} style={{ background: currencyColors[record.coinName] }}>
              {isStake ? APY_STAKING_RANGE[record.coinName] || 'N/A' : Number(value).toFixed(2) + '%'}
            </div>
          );
        },
      },
      {
        title: 'Rewards',
        sorter: (a, b) => {
          return Number(a.number) - Number(b.number);
        },
        showSorterTooltip: false,
        dataIndex: 'number',
        render: (value, record) => {
          const rate = new BigNumber(record.rate);

          // XCRS staking
          const isXCRS = record.type === 2999;
          if (isXCRS) {
            const XCRSBalance = new BigNumber(wallet?.coins?.find((x) => x.coinType === 'XCRS')?.totalNumber || 0);
            const total = new BigNumber(value).plus(XCRSBalance);
            const price = rate.multipliedBy(total);

            return (
              <span>
                <b className="bolder white avenir">{formatNumberFixed(price.toString())}</b>&nbsp;
                <span className="disabled-4">{record.coinName}</span>
              </span>
            );
          }

          // Staking reward from API
          const isCaculateRewardFromAPI = record.type === 3 && COIN_CALCULATE_REWARD.includes(record.coinName);
          if (isCaculateRewardFromAPI) {
            return (
              <span>
                <b className="bolder white avenir">{formatNumberFixed(record.reward)}</b>&nbsp;
                <span className="disabled-4">{record.coinName}</span>
              </span>
            );
          }

          // ATOM Staking
          const needMultipleBySeven = record.type === 3 && COIN_MULTIPLE_SEVEN.includes(record.coinName);

          if (needMultipleBySeven) {
            const price = rate.multipliedBy(new BigNumber(value)).multipliedBy(7);
            return (
              <Space align="baseline">
                <div className="bolder white avenir">{formatNumberFixed(price)}</div>
                <div className="disabled-4">{record.coinName}</div>
              </Space>
            );
          }

          const isStakingORBS = record.type === 3 && record.coinName === 'ORBS';
          if (isStakingORBS) {
            const price = rate.multipliedBy(new BigNumber(value));
            return (
              <Space align="baseline">
                <div className="bolder white avenir">{formatNumberFixed(price)}</div>
                <div className="disabled-4">{record.coinName}</div>
              </Space>
            );
          }

          // Other staking and Earning
          const isCompounding = record.type === 3 && COIN_COMPOUNDING.includes(record.coinName);
          const price = rate.multipliedBy(new BigNumber(isCompounding ? record.numberRoot : value));
          return (
            <Space align="baseline">
              <b className="bolder white avenir">{formatNumberFixed(price)}</b>
              <span className="disabled-4">{record.coinName}</span>
            </Space>
          );
        },
      },
      {
        title: 'Staked',
        sorter: (a, b) => {
          return Number(a.orderTime) - Number(b.orderTime);
        },
        showSorterTooltip: false,
        dataIndex: 'orderTime',
        align: 'center',
        render: (value, record) => {
          const isStake = record.type === 3 || record.type === 2999;

          return isStake ? '- -' : dayjs(Number(value)).format('YYYY/MM/DD');
        },
      },
      {
        title: 'Redeems',
        sorter: (a, b) => {
          return Number(a.orderTime) - Number(b.orderTime);
        },
        showSorterTooltip: false,
        dataIndex: 'orderTime',
        align: 'center',
        render: (value, record) => {
          const isStake = record.type === 3 || record.type === 2999;

          return isStake
            ? '- -'
            : dayjs(Number(value)).add(EARNING_REDEEM_DAY[record.type], 'day').format('YYYY/MM/DD');
        },
      },
      {
        dataIndex: 'number',
        render: (amount, record) => {
          const isUnStake = record.type === 3 || record.type === 2999;
          const isRedeem = record.type === 2999;

          return (
            <Button
              onClick={() => {
                if (isRedeem) {
                  dispatch(
                    setRedeemModal({
                      coinName: record.coinName,
                      type: record.type,
                      number: amount,
                      orderId: record.orderId,
                    })
                  );
                  return;
                }

                dispatch(
                  setUnstakeModal({
                    coin: record.coinName,
                    type: record.type,
                    max: amount,
                    min: record.min || '1',
                    orderId: record.orderId,
                  })
                );
              }}
              type={isRedeem ? 'buy' : isUnStake ? 'error' : 'disabled'}
              size="small"
              // disabled if stake ETH || AVAX
              disabled={record.status !== 1 || (COIN_CAN_NOT_UNSTAKED.includes(record.coinName) && record.type === 3)}
            >
              {isRedeem ? 'Redeem' : isUnStake ? 'Unstake' : 'Cancel'}
            </Button>
          );
        },
      },
    ] as ColumnsType<ILockerOrder>;
  }, [dispatch, wallet, autoCompoundConfig, t]);

  return (
    <div className={styles.root}>
      <div className={styles.table}>
        <Table
          loading={lockedInfoLoading}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          rowKey="id"
          dataSource={lockedInfo?.lockOrders || []}
          columns={columns}
          scroll={{ x: true }}
          locale={{
            emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data" />,
          }}
        />
      </div>

      <UnstakeModal />
      <RedeemModal />
    </div>
  );
};

export default EarningTable;
