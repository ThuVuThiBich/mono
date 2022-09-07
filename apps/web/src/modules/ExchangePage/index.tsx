/* eslint-disable no-case-declarations */
import { FC, useEffect, useMemo, useRef } from 'react';

import { ExchangeWebsocketProvider } from '@cross/context';
import { getCookies, setCookies } from '@cross/cookies';
import { useConvertData, useTrades } from '@cross/hooks';
import { usePairListQuery } from 'api/exchange';
import { useAppDispatch, useAppSelector } from 'hooks';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { setCurrentPairValue } from 'store/ducks/exchange/slice';
import { setPairSelector } from 'store/ducks/system/slice';
import { routes } from 'types/routes';
import { USER_COOKIES, WEB_SOCKET_URL } from 'utils/constant';
import { nDecimalFormat } from 'utils/number';
import Renderer from './Renderer';
import { getAuthToken } from 'api/auth';
import { useUser } from 'api/account';

const ExchangePage: FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currentPairValue } = useAppSelector((state) => state.exchange);

  const currentPair = useRouter().query.id as string;

  const previousPair = useRef<any>(null);

  useEffect(() => {
    !currentPair && router.push(`${routes.exchange}/BTC_USDT}`);
  }, [currentPair, router]);

  useEffect(() => {
    previousPair.current = currentPair;
  }, [currentPair]);

  const { tradesData } = useTrades(currentPair);

  const { data: pairList } = usePairListQuery({
    leverage: 'ALL',
  });

  useEffect(() => {
    return () => {
      dispatch(setPairSelector(false));
    };
  }, [dispatch]);

  const { convertData } = useConvertData(pairList);

  // identify current pair
  useEffect(() => {
    if (convertData.length > 0) {
      let allPair: any = [];

      convertData.forEach((convertedItem: any) => {
        if (convertedItem.list_m && convertedItem.list_m.length > 0) {
          convertedItem.list_m.forEach((item: any) => {
            allPair.push(item);
          });
        }
      });

      let savedPair = getCookies(USER_COOKIES.currentPair);

      const currentPair = allPair.find((x: any) => x.pair === savedPair) || allPair[0];

      setCookies(USER_COOKIES.currentPair, currentPair.data[0]);
      dispatch(setCurrentPairValue(currentPair.data));
    }
  }, [convertData, dispatch]);

  // handle data show on head
  const pair = useMemo(() => {
    return currentPair ? currentPair.replace('_', '/') + ' ｜ ' : '';
  }, [currentPair]);

  const lastTradePrice = useMemo(() => {
    if (!tradesData?.lastPrice) return '';
    return nDecimalFormat(tradesData?.lastPrice.toString(), currentPairValue?.[3] ?? 2) + ' ｜ ';
  }, [tradesData, currentPairValue]);

  const { user } = useUser();
  
  const currentSubAccount = useAppSelector((state) => state.subAccount.currentSubAccount);

  return (
    <>
      <Head>
        <title>
          {lastTradePrice} {pair} Ultorex
        </title>
      </Head>
      <ExchangeWebsocketProvider
        pair={currentPair}
        prePair={previousPair.current}
        pairList={pairList}
        webSocketURL={WEB_SOCKET_URL}
        user={user!}
        currentSubAccount={currentSubAccount}
        getAuthToken={getAuthToken}
      >
        <Renderer />
      </ExchangeWebsocketProvider>
    </>
  );
};

export default ExchangePage;
