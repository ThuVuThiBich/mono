/* eslint-disable react/display-name */
import { FC, useEffect, useState, memo } from 'react';
import styles from '../styles.module.less';
import { InputTrade } from '../../components/InputTrade';
import { Button, Checkbox, InputSlider, Toast } from '@cross/ui';
import { useAppSelector } from 'hooks';
import { placeOrderMarket } from 'api/market';
import { useMutation } from 'react-query';
import { TError } from 'api/types';
import { useTranslation } from 'next-i18next';
import { fixed } from 'utils/number';
import { getOrderBookSelect } from 'store/ducks/exchange/slice';
import BigNumber from 'bignumber.js';
import { Undefined } from 'types/util-types';
import { useUser } from 'api/account';
import { routes } from 'types/routes';
import { useRouter } from 'next/router';

BigNumber.config({ EXPONENTIAL_AT: 1e9 });

interface LimitOrderProps {
  data: Data;
  setData: (orderData: any, orderSide?: 'buy' | 'sell') => void;
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
  makeOrder: boolean;
  price?: number | string;
  amount?: number | string;
  total?: number | string;
  amountIceberg?: number;
  slider: number;
}

export const LimitOrder: FC<LimitOrderProps> = memo(
  ({
    data,
    setData,
    filterSide,
    available,
    moneyCoin,
    coin = '',
    coinLimit,
    coinDecimalAmount,
    moneyCoinDecimalAmount,
  }: LimitOrderProps) => {
    const { t } = useTranslation();
    const { user } = useUser();
    const router = useRouter();

    const orderBookSelect = useAppSelector(getOrderBookSelect);

    const [slider, setSlider] = useState(0);
    const [amountIceberg, setAmountIceberg] = useState<Undefined<number>>(0);

    // Avoid infinity when divided buy 0
    const maxAmount =
      filterSide === 'buy' && Number(data.price) !== 0 ? Number(available) / Number(data.price) : Number(available);

    useEffect(() => {
      if (orderBookSelect?.price) {
        const price = new BigNumber(orderBookSelect.price);
        const amount = new BigNumber(orderBookSelect.amount);
        const total = price.multipliedBy(amount);

        const limitData = {
          ...data,
          price: price.toString(),
          amount: amount.toString(),
          total: total.toString(),
        };
        const orderSide = orderBookSelect.type === 'asks' ? 'buy' : 'sell';

        setData(limitData, orderSide);
        setSlider((amount.toNumber() / maxAmount) * 100);
      }
    }, [orderBookSelect]);

    const { mutateAsync: mutatePlaceOrder, status: placeOrderStatus } = useMutation(placeOrderMarket, {
      onSuccess: () => {
        Toast('success', t(' order_success'));
      },
      onError: (error: TError) => {
        Toast('error', error.msg_code);
      },
    });

    const handleChangeData = (key: string, value: any) => {
      setData({ ...data, [key]: value });
    };

    const handleChangeAmount = (value: any) => {
      if (value === '') {
        return setData({ ...data, amount: '', total: '' });
      }

      const price = new BigNumber(data?.price || 0);
      const amount = new BigNumber(value);
      const total = price.multipliedBy(amount);

      setData({
        ...data,
        price: price.toString(),
        amount: amount.toString(),
        total: total.toString(),
      });
    };

    const handleChangePrice = (value: any) => {
      if (value === '') {
        return setData({ ...data, price: '', total: '0' });
      }

      const amount = new BigNumber(data?.amount || 0);
      const price = new BigNumber(value);
      const total = price.multipliedBy(amount);

      setData({
        ...data,
        price: price.toString(),
        amount: amount.toString(),
        total: total.toString(),
      });
    };

    const handleChangeTotal = (value: any) => {
      if (value === '') {
        return setData({ ...data, amount: '', total: '' });
      }
      const total = new BigNumber(value);
      const price = new BigNumber(data?.price || 0);
      const amount = total.dividedBy(price);
      setData({
        ...data,
        price: price.toString(),
        amount: amount.toString(),
        total: total.toString(),
      });
    };

    const handleOrder = (isBuy: boolean) => {
      const orderData = {
        coin1: coin,
        coin2: moneyCoin,
        type: 'LIMIT',
        is_bid: isBuy,
        param1: Number(fixed('' + data.price, Number(moneyCoinDecimalAmount))),
        param2: Number(fixed('' + data.amount, Number(coinDecimalAmount))),
        param3: 0,
        pool: 1,
        iceberg: data.iceberg,
        numberIceberg: amountIceberg || 0,
      };

      switch (true) {
        case !data.price || Number(data.price) === 0:
          Toast('error', t(' empty_price'));
          break;
        case !data.amount || Number(data.amount) === 0:
          Toast('error', t(' empty_amount'));
          break;
        case data.amount && Number(data.amount) < Number(coinLimit):
          Toast('error', 'Minimum trading amount' + coinLimit);
          break;
        case data.iceberg && !amountIceberg:
          Toast('error', t(' empty_iceberg_amount'));
          break;
        case data.iceberg && Number(amountIceberg) < Number(coinLimit):
          Toast('error', t(' iceberg_higher') + coinLimit);
          break;
        case data.iceberg && Number(amountIceberg) > Number(data.amount):
          Toast('error', t(' iceberg_smaller'));
          break;
        case data.iceberg && Number(amountIceberg) < Number(data.amount) / 100:
          Toast('error', t(' iceberg_higher') + Number(data.amount) / 100);
          break;
        // case filterSide === 'sell' && data?.amount && Number(data?.amount) > available:
        //   Toast('error', t(' not_enough_balance'));
        //   break;
        default:
          mutatePlaceOrder(orderData);
      }
    };

    const handleLogin = () => {
      router.push(`${routes.login}?redirect=${router.asPath}`);
    };

    return (
      <>
        <InputTrade
          id="limit-price"
          value={data.price}
          onChange={(value) => {
            handleChangePrice(value);
          }}
          coin={moneyCoin}
          title={t(' price')}
          precision={moneyCoinDecimalAmount}
        />
        <InputTrade
          id="limit-amount"
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
          id="limit-total"
          value={data.total}
          onChange={(value) => {
            handleChangeTotal(value);
            setSlider((value / Number(data?.price || 1) / maxAmount) * 100);
          }}
          coin={moneyCoin}
          title={t(' total')}
          precision={moneyCoinDecimalAmount}
        />
        <div className={styles.checkbox}>
          <Checkbox
            checked={data.iceberg}
            onChange={() => {
              handleChangeData('iceberg', !data.iceberg);
              setAmountIceberg(undefined);
            }}
          >
            Iceberg
          </Checkbox>
        </div>
        {data.iceberg && (
          <InputTrade
            value={amountIceberg}
            onChange={(value) => {
              setAmountIceberg(value);
            }}
            coin={coin}
            title={t(' amount')}
            precision={coinDecimalAmount}
          />
        )}
        {/* <div className={styles.checkbox}>
          <Checkbox
            checked={data.makeOrder}
            onChange={() => {
              handleChangeData('makeOrder', !data.makeOrder);
            }}
          >
            {t(' make_order')}
          </Checkbox>
        </div> */}
        <div className={styles.buttonContainer}>
          {filterSide === 'buy' ? (
            <Button
              id="limit-submit-button"
              type="buy"
              className={styles.submitButton}
              onClick={() => (user ? handleOrder(true) : handleLogin())}
              loading={placeOrderStatus === 'loading'}
            >
              {user ? 'Buy' + ' ' + coin : 'Login to trade'}
            </Button>
          ) : (
            <Button
              id="limit-submit-button"
              type="sell"
              className={styles.submitButton}
              onClick={() => (user ? handleOrder(false) : handleLogin())}
              loading={placeOrderStatus === 'loading'}
            >
              {user ? 'Sell' + ' ' + coin : 'Login to trade'}
            </Button>
          )}
        </div>
      </>
    );
  }
);
