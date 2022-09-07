import { request } from './../axios';
import { useQuery, UseQueryOptions } from 'react-query';
import { getDigitalCoin } from './request';
import { ICoingecko, ICoingeckoId, ICoingeckoParams, IOrbsPrice, ISimplexBuyInfo, TGetDigitalCoin } from './types';
import useDebounce from 'hooks/useDebounce';
import axios from 'axios';

export const useGetCreditFiats = (options?: UseQueryOptions<string[]>) => {
  return useQuery<string[]>(
    'get/credit/fiats',
    async () => {
      const { data } = await request.post('/get/credit/fiats');
      return data;
    },
    options
  );
};

export const useGetCreditCoins = (options?: UseQueryOptions<string[]>) => {
  return useQuery<string[]>(
    'get/credit/coins',
    async () => {
      const { data } = await request.post('/get/credit/coins');
      return data;
    },
    options
  );
};

export const useSimplexBuyPrice = (params: TGetDigitalCoin, options?: UseQueryOptions<ISimplexBuyInfo>) => {
  const debounceParams = useDebounce(params, 1000);
  return useQuery<ISimplexBuyInfo>(
    ['/payment/buy-price', debounceParams],
    () => getDigitalCoin(debounceParams),
    options
  );
};

export const useCoinGeckoPrice = (params: ICoingeckoParams, options?: UseQueryOptions<ICoingecko>) => {
  return useQuery<ICoingecko>(
    ['api.coingecko.com/api/v3/simple/price', params],
    async () => {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${params.from}&vs_currencies=${params.to}`
      );
      return data;
    },
    { enabled: !!params.to && !!params.from, ...options }
  );
};

export const useCoingeckoId = (options?: UseQueryOptions<ICoingeckoId[]>) => {
  return useQuery<ICoingeckoId[]>(
    `https://api.coingecko.com/api/v3/coins/list`,
    async () => {
      const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/list`);
      return data;
    },
    { ...options }
  );
};

export const useOrbsPrice = (options?: UseQueryOptions<IOrbsPrice>) => {
  return useQuery<IOrbsPrice>(
    `https://web.ultorex.org/api/markets/ORBS_USDT`,
    async () => {
      const { data } = await axios.get(`https://web.ultorex.org/api/markets/ORBS_USDT`);
      return data.data;
    },
    { ...options }
  );
};
