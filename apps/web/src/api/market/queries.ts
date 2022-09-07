import { authRequest, request } from 'api/axios';
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

export const placeOrderMarket = async (request: any): Promise<any> => {
  const { data } = await authRequest.post(`/bb/market/order/place-order`, request);
  return data;
};
