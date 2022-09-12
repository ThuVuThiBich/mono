import { request } from 'api/axios';
import useDebounce from 'hooks/useDebounce';
import { useQuery, UseQueryOptions } from 'react-query';
import {
  getAllWithdrawAddressRequest,
  getConvertCoinInfoRequest,
  getConvertCoinList,
  getStableCoinRequest,
  getSupportChainRequest,
} from './request';
import {
  IDepositAddress,
  WalletGroupItem,
  IWithdrawAddress,
  IWithdrawFee,
  IMinimalWithdrawCoin,
  IWithdrawOrderInfo,
  IChainSupported,
  IConvertCoinParams,
  IConvertCoinInfo,
} from './types';

export function useWalletQuery(options?: UseQueryOptions<WalletGroupItem>) {
  return useQuery<WalletGroupItem>(
    '/bb/asset/show',
    async () => {
      const { data } = await request.post('/bb/asset/show');
      return data;
    },
    options
  );
}

export function useSubAccountWallet(accountId: string, options?: UseQueryOptions<WalletGroupItem>) {
  return useQuery<WalletGroupItem>(
    ['/bb/asset/show/account', accountId],
    async () => {
      const { data } = await request.post('/bb/asset/show/account', { accountId });
      return data;
    },
    options
  );
}

export const useDepositAddress = (
  params: { chain: string; coin: string },
  options?: UseQueryOptions<IDepositAddress>
) => {
  return useQuery<IDepositAddress>(
    ['/x-wallet/user/apply-deposit-address', params],
    async () => {
      const { data } = await request.post(`/x-wallet/user/apply-deposit-address`, params);
      return data;
    },
    options
  );
};

export const useWithdrawAddress = (params: { coin_type: string }, options?: UseQueryOptions<IWithdrawAddress>) => {
  return useQuery<IWithdrawAddress>(
    ['/user/asset/withdraw/address', params],
    () => getAllWithdrawAddressRequest(params),
    options
  );
};

export const useMinimalWithdrawCoin = (
  params: { coinType: string },
  options?: UseQueryOptions<IMinimalWithdrawCoin>
) => {
  return useQuery<IMinimalWithdrawCoin>(
    ['/bb/withdraw/verify/num', params],
    async () => {
      const { data } = await request.post(`/bb/withdraw/verify/num`, params);
      return data;
    },
    options
  );
};

export const useWithdrawFee = (params: { type: string }, options?: UseQueryOptions<IWithdrawFee>) => {
  return useQuery<IWithdrawFee>(
    ['/user/asset/show/coin', params],
    async () => {
      const { data } = await request.post(`/user/asset/show/coin`, params);
      return data;
    },
    options
  );
};

export const useWithdrawOrder = (
  params: { order_id: string; account: string },
  options?: UseQueryOptions<IWithdrawOrderInfo>
) => {
  return useQuery<IWithdrawOrderInfo>(
    ['/user/asset/withdraw/get/order', params],
    async () => {
      const { data } = await request.post(`/user/asset/withdraw/get/order`, params);
      return data;
    },
    options
  );
};

export const useChainSupport = (coin: string, options?: UseQueryOptions<IChainSupported>) => {
  return useQuery<IChainSupported>([`v2/finance/support-chain`, coin], () => getSupportChainRequest(coin), options);
};

export const useConvertCoinInfo = (params: IConvertCoinParams, options?: UseQueryOptions<IConvertCoinInfo>) => {
  const debounceParams = useDebounce(params, 600);

  return useQuery<IConvertCoinInfo>(
    [`/bb/get/convertCoin`, debounceParams],
    () => getConvertCoinInfoRequest(debounceParams),
    options
  );
};

export const useCoinConvertList = (options?: UseQueryOptions<string[]>) => {
  return useQuery<string[]>([`bb/get/convertCoinList`], getConvertCoinList, options);
};
export const useStableCoinInfo = (options?: UseQueryOptions<string[]>) => {
  return useQuery<string[]>('/dpwd-information/finance/stable-coins', getStableCoinRequest, options);
};
