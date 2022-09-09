import { FC, useEffect, useState } from 'react';
import styles from '../styles.module.less';
import { InputTrade } from '../../components/InputTrade';
import { Button, Checkbox, InputSlider, Toast } from '@cross/ui';
import { useAppSelector } from 'hooks';
import { OrderPlacePopup } from '../../components/OrderPlacePopup';
import { placeOrderMarket } from 'api/market';
import { useMutation } from 'react-query';
import { TError } from 'api/types';
import { useTranslation } from 'react-i18next';
import { fixed } from 'utils/number';
import BigNumber from 'bignumber.js';
import { getOrderBookSelect } from 'store/ducks/exchange/slice';
import { useUser } from 'api/account';
import { useRouter } from 'next/router';
import { routes } from 'types/routes';

BigNumber.config({ EXPONENTIAL_AT: 1e9 });

interface StopOrderProps {
  data: Data;
  setData: Function;
  filterSide: 'buy' | 'sell';
  available: string | number;
  moneyCoin: string;
  coin: string;
  coinLimit: number;
  coinDecimalAmount: number;
  moneyCoinDecimalAmount: number;
}

export interface Data {
  iceberg: boolean;
  stop: number | undefined;
  limit: number | undefined;
  amount: number | undefined;
  total: number | undefined;
  amountIceberg: number | undefined;
}

export const StopOrder: FC<StopOrderProps> = ({
  data,
  setData,
  filterSide,
  available,
  moneyCoin,
  coin = '',
  coinLimit,
  coinDecimalAmount,
  moneyCoinDecimalAmount,
}: StopOrderProps) => {
  const { t } = useTranslation();

  const { user } = useUser();
  const orderBookSelect = useAppSelector(getOrderBookSelect);
  const [visible, setVisible] = useState<boolean>(false);
  const [slider, setSlider] = useState<number>(0);
  const maxAmount = filterSide === 'buy' ? Number(available) / (data?.limit || 1) : Number(available);
  const router = useRouter();

  const orderData = {
    coin1: coin,
    coin2: moneyCoin,
    type: 'STOP',
    is_bid: filterSide === 'buy',
    param1: Number(fixed('' + data.stop, Number(moneyCoinDecimalAmount))),
    param2: Number(fixed('' + data.limit, Number(moneyCoinDecimalAmount))),
    param3: Number(fixed('' + data.amount, Number(coinDecimalAmount))),
    pool: 1,
  };

  useEffect(() => {
    if (orderBookSelect?.price) {
      const price = new BigNumber(orderBookSelect.price);
      const amount = new BigNumber(orderBookSelect.amount);
      const total = price.multipliedBy(amount);

      const orderSide = orderBookSelect.type === 'asks' ? 'buy' : 'sell';
      const orderData = {
        ...data,
        stop: price.toString(),
        limit: price.toString(),
        amount: amount.toString(),
        total: total.toString(),
      };
      setData(orderData, orderSide);
    }
  }, [orderBookSelect]);

  const { mutateAsync: mutatePlaceOrderMarket, status: placeOrderStatus } = useMutation(placeOrderMarket, {
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

  const handleChangeAmount = (value: any) => {
    if (value === '') {
      return setData({ ...data, amount: '', total: '' });
    }

    const amount = new BigNumber(value);
    const limit = new BigNumber(data?.limit || 0);
    const total = limit.multipliedBy(amount);
    setData({
      ...data,
      amount: amount.toString(),
      limit: limit.toString(),
      total: total.toString(),
    });
  };

  const handleChangeLimit = (value: any) => {
    if (value === '') {
      return setData({ ...data, limit: '', total: '' });
    }

    const limit = new BigNumber(value);
    const amount = new BigNumber(data?.amount || 0);
    const total = limit.multipliedBy(amount);
    setData({
      ...data,
      limit: limit.toString(),
      amount: amount.toString(),
      total: total.toString(),
    });
  };

  const handleChangeTotal = (value: any) => {
    if (value === '') {
      return setData({ ...data, amount: '', total: '' });
    }

    const total = new BigNumber(value);
    const limit = new BigNumber(data?.limit || 1);
    const amount = total.dividedBy(limit);
    setData({
      ...data,
      amount: amount.toString(),
      total: total.toString(),
      limit: limit.toString(),
    });
  };

  const handleOrder = () => {
    switch (true) {
      case !data.stop || Number(data.stop) === 0:
        Toast('error', t(' empty_stop'));
        break;
      case !data.limit || Number(data.limit) === 0:
        Toast('error', t(' empty_limit'));
        break;
      case !data.amount || Number(data.amount) === 0:
        Toast('error', t(' empty_amount'));
        break;
      case data.amount && Number(data.amount) < coinLimit:
        Toast('error', 'Minimum trading amount' + coinLimit);
        break;
      // case filterSide === 'buy' && data?.total && Number(data?.total) > available:
      //   Toast('error', t(' not_enough_balance'));
      //   break;
      // case filterSide === 'sell' && data?.amount && Number(data?.amount) > available:
      //   Toast('error', t(' not_enough_balance'));
      //   break;
      default:
        setVisible(true);
    }
  };

  const handleLogin = () => {
    router.push(`${routes.login}?redirect=${router.asPath}`);
  };

  return (
    <>
      {visible && (
        <OrderPlacePopup
          visible={visible}
          onCancel={() => setVisible(false)}
          stop={data.stop}
          limit={data.limit}
          amount={data.amount}
          side={filterSide}
          coin={coin}
          moneyCoin={moneyCoin}
          onConfirm={() => {
            mutatePlaceOrderMarket(orderData);
          }}
          coinDecimalAmount={coinDecimalAmount}
          moneyCoinDecimalAmount={moneyCoinDecimalAmount}
        />
      )}
      <InputTrade
        value={data.stop}
        onChange={(value) => {
          handleChangeData('stop', value);
        }}
        coin={moneyCoin}
        title={t(' stop')}
        precision={moneyCoinDecimalAmount}
      />
      <InputTrade
        value={data.limit}
        onChange={(value) => {
          handleChangeLimit(value);
        }}
        coin={moneyCoin}
        title={t(' limit')}
        precision={moneyCoinDecimalAmount}
      />
      <InputTrade
        value={data.amount}
        onChange={(value) => {
          handleChangeAmount(value);
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
          handleChangeAmount(value);
        }}
        maxValue={maxAmount}
      />
      <InputTrade
        value={data.total}
        onChange={(value) => {
          handleChangeTotal(value);
          setSlider((value / (data?.limit || 1) / maxAmount) * 100);
        }}
        coin={moneyCoin}
        title={t(' total')}
        precision={moneyCoinDecimalAmount}
      />
      {/* <div className={styles.checkbox}>
        <Checkbox
          checked={data.iceberg}
          onChange={() => {
            handleChangeData('iceberg', !data.iceberg);
          }}
        >
          Iceberg
        </Checkbox>
      </div>
      {data.iceberg && (
        <InputTrade
          value={data.amountIceberg}
          onChange={(value) => {
            handleChangeData('amountIceberg', value);
          }}
          coin={coin}
          title={t(' amount')}
          precision={coinDecimalAmount}
        />
      )} */}
      <div className={styles.buttonContainer}>
        {filterSide === 'buy' ? (
          <Button
            type="buy"
            className={styles.submitButton}
            onClick={() => (user ? handleOrder() : handleLogin())}
            loading={placeOrderStatus === 'loading'}
          >
            {user ? t(' buy') + ' ' + coin : 'Login'}
          </Button>
        ) : (
          <Button
            type="sell"
            className={styles.submitButton}
            onClick={() => (user ? handleOrder() : handleLogin())}
            loading={placeOrderStatus === 'loading'}
          >
            {user ? t(' sell') + ' ' + coin : 'Login'}
          </Button>
        )}
      </div>
    </>
  );
};
