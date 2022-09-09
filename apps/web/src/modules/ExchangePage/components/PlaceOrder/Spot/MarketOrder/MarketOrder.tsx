import { FC, useEffect, useState } from 'react';
import styles from '../styles.module.less';
import { InputTrade } from '../../components/InputTrade';
import { Button, InputSlider, Toast } from '@cross/ui';
import { placeOrderMarket } from 'api/market';
import { useMutation } from 'react-query';
import { TError } from 'api/types';
import { fixed } from 'utils/number';
import { useAppSelector } from 'hooks/reduxHook';
import { getListPairValue, getOrderBookSelect } from 'store/ducks/exchange/slice';
import { useTypeSafeTranslation } from 'hooks';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useUser } from 'api/account';
import { routes } from 'types/routes';

interface MarketOrderProps {
  data: Data;
  setData: (orderData: any, orderSide?: 'buy' | 'sell') => void;
  filterSide: 'buy' | 'sell';
  available: string | number;
  moneyCoin: string;
  coin: string;
  coinLimit: number;
  coinDecimalAmount: number;
}
export interface Data {
  amount: number | undefined;
}

export const MarketOrder: FC<MarketOrderProps> = ({
  data,
  setData,
  filterSide,
  available,
  moneyCoin,
  coin = '',
  coinLimit,
  coinDecimalAmount,
}: MarketOrderProps) => {
  const { t } = useTypeSafeTranslation();

  const { user } = useUser();
  const orderBookSelect = useAppSelector(getOrderBookSelect);
  const [slider, setSlider] = useState<number>(0);
  // const { currentPair } = useAppSelector((state) => state.system.exchange);
  const currentPair = useRouter().query.id as string;
  const router = useRouter();

  const listPairValue = useAppSelector(getListPairValue);
  const pairData = listPairValue.find((listPairValue_item: any) => listPairValue_item.pair === currentPair);
  const maxAmount =
    filterSide === 'buy' && Number(pairData?.buy) !== 0 ? Number(available) / Number(pairData?.buy) : Number(available);

  const { mutateAsync: mutatePlaceOrderMarket, isLoading } = useMutation(placeOrderMarket, {
    onSuccess: () => {
      Toast('success', t(' order_success'));
    },
    onError: (error: TError) => {
      Toast('error', error.message);
    },
  });

  const handleChangeData = (key: string, value: any) => {
    setData({ ...data, [key]: value });
  };

  const handleOrder = (isBuy: boolean) => {
    const orderData = {
      coin1: coin,
      coin2: moneyCoin,
      type: 'MARKET',
      is_bid: isBuy,
      param1: Number(pairData?.last),
      param2: Number(fixed('' + data.amount, Number(coinDecimalAmount))),
      param3: 0,
      pool: 1,
    };
    switch (true) {
      case !data.amount || Number(data.amount) === 0:
        Toast('error', t(' empty_amount'));
        break;
      case data.amount && Number(data.amount) < Number(coinLimit):
        Toast('error', 'Minimum trading amount' + coinLimit);
        break;
      // case data?.amount && data?.amount > available:
      //   Toast('error', t(' not_enough_balance'));
      //   break;
      default:
        mutatePlaceOrderMarket(orderData);
    }
  };

  useEffect(() => {
    if (orderBookSelect?.price) {
      const amount = orderBookSelect.amount;
      const orderSide = orderBookSelect.type === 'asks' ? 'buy' : 'sell';
      const orderData = { ...data, amount: amount };

      setData(orderData, orderSide);
    }
  }, [orderBookSelect]);

  const handleLogin = () => {
    router.push(`${routes.login}?redirect=${router.asPath}`);
  };

  return (
    <>
      <InputTrade id="market-price" text="Market" type="text" coin={moneyCoin} title={t(' price')} disabled />{' '}
      <InputTrade
        id="market-amount"
        value={data.amount}
        onChange={(value) => {
          handleChangeData('amount', value);
          setSlider((value / maxAmount) * 100);
        }}
        coin={coin}
        title={t(' amount')}
        precision={coinDecimalAmount}
      />
      <div className="right primary">
        <small>
          <i>{'Minimum trading amount: ' + coinLimit}</i>
        </small>
      </div>
      <InputSlider
        handle="black"
        disabled={!user}
        value={slider}
        handleChange={(value: number) => {
          setSlider((value / maxAmount) * 100);
          handleChangeData('amount', value);
        }}
        maxValue={maxAmount}
      />
      <div className={styles.buttonContainer}>
        {filterSide === 'buy' ? (
          <Button
            id="market-submit-button"
            type="buy"
            className={clsx(styles.submitButton, styles.mt32)}
            onClick={() => (user ? handleOrder(true) : handleLogin())}
            loading={isLoading}
          >
            {user ? t(' buy') + ' ' + coin : 'Login'}
          </Button>
        ) : (
          <Button
            id="market-submit-button"
            type="sell"
            className={clsx(styles.submitButton, styles.mt32)}
            onClick={() => (user ? handleOrder(false) : handleLogin())}
            loading={isLoading}
          >
            {user ? t(' sell') + ' ' + coin : 'Login'}
          </Button>
        )}
      </div>
    </>
  );
};
