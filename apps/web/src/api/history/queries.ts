import { authRequest, request } from 'api/axios';
import { useQuery, UseQueryOptions } from 'react-query';
import { IWalletHistoryResponse, IWalletHistoryParams, TRequestHistory, TSuccessResponse } from './types';

export function usePairAllQuery(options?: any) {
  return useQuery(
    '/bb/symbol/all',
    async () => {
      const { data } = await request.post(`/bb/symbol/all`);
      return data;
    },
    options
  );
}

export const useWalletHistory = (params: IWalletHistoryParams, options?: UseQueryOptions<IWalletHistoryResponse>) => {
  return useQuery<IWalletHistoryResponse>(
    ['/user/asset/wallet/history', params],
    async () => {
      const { data } = await authRequest.post(`/user/asset/wallet/history`, params);
      return data;
    },
    options
  );
};

export const useTradeHistory = (params: TRequestHistory, options?: UseQueryOptions<TSuccessResponse>) => {
  return useQuery<TSuccessResponse>(
    ['/bb/market/order/trade/history', params],
    async () => {
      const { data } = await authRequest.post(`/bb/market/order/trade/history`, params);
      return data;
    },
    options
  );
};

export const useOrderHistory = (params: TRequestHistory, options?: UseQueryOptions<TSuccessResponse>) => {
  return useQuery<TSuccessResponse>(
    ['/bb/market/order/order/history', params],
    async () => {
      const { data } = await authRequest.post(`/bb/market/order/order/history`, params);
      return data;
    },
    options
  );
};
