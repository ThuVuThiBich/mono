/* eslint-disable react/display-name */
import { useTrades, useWallet } from '@cross/hooks';
import { FilterGroup } from '@cross/ui';
import { faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Space } from 'antd';
import { useUser } from 'api/account';
import { usePairListQuery } from 'api/pair_list';
import { useAppDispatch, useAppSelector } from 'hooks';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getCurrentPairValue, setOrderBookSelect } from 'store/ducks/exchange/slice';
import { formatNumber } from 'utils/number';
import { BuySellSelect } from '../components/BuySellSelect';
import { LimitOrder } from './LimitOrder';
import { Data as LimitData } from './LimitOrder/LimitOrder';
import { MarketOrder } from './MarketOrder';
import { Data as MarketData } from './MarketOrder/MarketOrder';
import { StopOrder } from './StopOrder';
import { Data as StopData } from './StopOrder/StopOrder';
import styles from './styles.module.less';

type IFilterSide = 'buy' | 'sell';
type IFilterType = 'limit' | 'market' | 'stop';

interface InputData {
  buy_limit: LimitData;
  buy_market: MarketData;
  buy_stop: StopData;
  sell_limit: LimitData;
  sell_market: MarketData;
  sell_stop: StopData;
}

const SpotTrade: FC = memo(() => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { user } = useUser();

  const { walletFree: availableWallet } = useWallet();

  const currentPair = useRouter().query.id as string;

  const lastTradePrice = useTrades(currentPair)?.tradesData?.lastPrice;

  const currentPairValue = useAppSelector(getCurrentPairValue);
  const { data: pairs } = usePairListQuery();

  const prevPair = useRef('');

  const [filterSide, setFilterSide] = useState<IFilterSide>('buy');
  const [filterType, setFilterType] = useState<IFilterType>('limit');

  const [inputData, setInputData] = useState<InputData>({
    buy_limit: {
      iceberg: false,
      makeOrder: true,
      price: 0,
      amount: undefined,
      total: undefined,
      amountIceberg: 0,
      slider: 0,
    },
    buy_market: { amount: undefined },
    buy_stop: {
      iceberg: false,
      stop: undefined,
      limit: 0,
      amount: undefined,
      total: undefined,
      amountIceberg: 0,
    },
    sell_limit: {
      iceberg: false,
      makeOrder: true,
      price: 0,
      amount: undefined,
      total: undefined,
      amountIceberg: 0,
      slider: 0,
    },
    sell_market: { amount: undefined },
    sell_stop: {
      iceberg: false,
      stop: undefined,
      limit: 0,
      amount: undefined,
      total: undefined,
      amountIceberg: 0,
    },
  });

  // Init price + limit price when pair change
  useEffect(() => {
    if (lastTradePrice) prevPair.current = '';
  }, [currentPair]);

  useEffect(() => {
    if (prevPair.current !== currentPair && lastTradePrice) {
      setInputData((old) => {
        let oldClone = { ...old };
        oldClone.buy_limit.price = lastTradePrice;
        oldClone.buy_limit.amount = undefined;
        oldClone.buy_limit.total = undefined;
        oldClone.sell_limit.price = lastTradePrice;
        oldClone.sell_limit.amount = undefined;
        oldClone.sell_limit.total = undefined;

        oldClone.buy_stop.limit = lastTradePrice;
        oldClone.buy_stop.amount = undefined;
        oldClone.buy_stop.total = undefined;
        oldClone.buy_stop.stop = undefined;
        oldClone.sell_stop.limit = lastTradePrice;
        oldClone.sell_stop.amount = undefined;
        oldClone.sell_stop.total = undefined;
        oldClone.sell_stop.stop = undefined;

        return oldClone;
      });
      prevPair.current = currentPair;
    }
  }, [lastTradePrice]);

  const setData = (data: any, orderSide?: 'buy' | 'sell') => {
    const orderMode = (orderSide || filterSide) + '_' + filterType;
    if (orderSide) setFilterSide(orderSide);

    setInputData({
      ...inputData,
      [orderMode]: data,
    });
  };

  /** Update input data when change side. Because of inputTrade not fire onChange when change value */
  const handleSideChange = useCallback(
    (e) => {
      const prevOrderMode = (filterSide + '_' + filterType) as keyof InputData;
      const curOrderMode = (e.target.value + '_' + filterType) as keyof InputData;

      setInputData({
        ...inputData,
        [curOrderMode]: inputData[prevOrderMode],
      });
      setFilterSide(e.target.value);
    },
    [filterSide, inputData, filterType]
  );

  /**Renderer */
  const coin = useMemo(() => currentPair?.split('_')[0], [currentPair]);
  const moneyCoin = useMemo(() => currentPair?.split('_')[1], [currentPair]);

  const available = useMemo(() => {
    return {
      coin: (user && availableWallet[coin]?.number) || '0',
      money: (user && Number(availableWallet[moneyCoin]?.number)) ?? '0',
    };
  }, [availableWallet, moneyCoin, coin, user]);

  const currentPairData = useMemo(() => pairs?.find((pair: any) => pair[0] === currentPair), [currentPair, pairs]);

  const coinDecimalAmount = useMemo(() => Number((currentPairData && currentPairData[2]) || 0), [currentPairData]);
  const moneyCoinDecimalAmount = useMemo(() => Number((currentPairData && currentPairData[3]) || 0), [currentPairData]);

  const coinLimit = useMemo(() => {
    return currentPairValue?.[1];
  }, [currentPairValue]);

  return (
    <div className={styles.root}>
      <BuySellSelect value={filterSide} onChange={handleSideChange} />
      <Space size={8} align="center" className={styles.available}>
        <div>
          <FontAwesomeIcon icon={faWallet} color="#788686" className={styles.walletIcon} />
          <span className={styles.walletText}>Available</span>
        </div>
        <div>
          <span id="wallet-available">
            {filterSide === 'buy'
              ? `${formatNumber(available.money, currentPairValue?.[3] ?? 2)} ${moneyCoin || ''} `
              : `${formatNumber(available.coin, currentPairValue?.[2] ?? 2)} ${coin || ''} `}
          </span>
        </div>
      </Space>
      <FilterGroup
        datas={[
          { label: 'Limit', value: 'limit' },
          {
            label: 'Market',
            value: 'market',
          },
          { label: 'Stop', value: 'stop' },
        ]}
        value={filterType}
        onChange={(e) => {
          setFilterType(e.target.value);
          dispatch(setOrderBookSelect({}));
        }}
        stretch
        className={styles.filter}
      />
      {filterType === 'limit' && (
        <LimitOrder
          data={filterSide === 'buy' ? inputData.buy_limit : inputData.sell_limit}
          setData={setData}
          filterSide={filterSide}
          available={filterSide === 'buy' ? Number(available.money) : Number(available.coin)}
          moneyCoin={moneyCoin}
          coin={coin}
          coinLimit={coinLimit}
          coinDecimalAmount={coinDecimalAmount}
          moneyCoinDecimalAmount={moneyCoinDecimalAmount}
        />
      )}
      {filterType === 'market' && (
        <MarketOrder
          data={filterSide === 'buy' ? inputData.buy_market : inputData.sell_market}
          setData={setData}
          filterSide={filterSide}
          available={filterSide === 'buy' ? Number(available.money) : Number(available.coin)}
          moneyCoin={moneyCoin}
          coin={coin}
          coinLimit={coinLimit}
          coinDecimalAmount={coinDecimalAmount}
        />
      )}
      {filterType === 'stop' && (
        <StopOrder
          data={filterSide === 'buy' ? inputData.buy_stop : inputData.sell_stop}
          setData={setData}
          filterSide={filterSide}
          available={filterSide === 'buy' ? Number(available.money) : Number(available.coin)}
          moneyCoin={moneyCoin}
          coin={coin}
          coinLimit={coinLimit}
          coinDecimalAmount={coinDecimalAmount}
          moneyCoinDecimalAmount={moneyCoinDecimalAmount}
        />
      )}
    </div>
  );
});

export default SpotTrade;
