import { request } from 'api/axios';
import { useQuery, UseQueryOptions } from 'react-query';
import { MarketGroupItem } from './types';

export function useMarketGroupQuery(options?: UseQueryOptions<MarketGroupItem[]>) {
  return useQuery<MarketGroupItem[]>(
    '/bb/symbol/market/group',
    async () => {
      const { data } = await request.post('/bb/symbol/market/group');
      return data.bbMarketList;
    },
    options
  );
}

export const placeOrderMarket = async (params: any): Promise<any> => {
  const { data } = await request.post(`/bb/market/order/place-order`, params);
  return data;
};
