import { useQuery, UseQueryOptions } from 'react-query';
import { authRequest } from 'api/axios';
import {
  CurrencyGroupItemResponse,
  TGetUserInfoResponse,
  TUserWithdrawnLimit,
  TCreditLimit,
  IOnboardInfo,
  IRightsTokenInfo,
  IUser,
} from './types';
import { getRightsTokenInfo, getUserWithdrawnLimit, getCreditLimit, getListFavorite, getMe } from './request';
import { USER_COOKIES } from 'utils/constant';
import { getCookies, parseJson, removeCookies, setCookies } from '@cross/cookies';

export const useCurrencyGroupItem = (options?: UseQueryOptions<CurrencyGroupItemResponse[]>) => {
  return useQuery<CurrencyGroupItemResponse[]>(
    'index/currency',
    async () => {
      const { data } = await authRequest.post(`/index/currency`);
      return data;
    },
    options
  );
};

export const useGetUserInfo = (options?: UseQueryOptions<any>) => {
  return useQuery<any>('/user/info', getMe, options);
};

export const useWithdrawLimit = (options?: UseQueryOptions<TUserWithdrawnLimit>) => {
  return useQuery<TUserWithdrawnLimit>('/user/assets/withdraw/limits', getUserWithdrawnLimit, options);
};

export const useCreditLimit = (fiat: string, options?: UseQueryOptions<TCreditLimit>) => {
  return useQuery<TCreditLimit>(['/credit/limit', fiat], () => getCreditLimit(fiat), options);
};

export const useWatchList = (option?: UseQueryOptions<string[]>) => {
  return useQuery<string[]>('/user/favorite/list', getListFavorite, option);
};
export const useOnboardInfo = (option?: UseQueryOptions<IOnboardInfo>) => {
  return useQuery<IOnboardInfo>(
    '/consumer/onboarding/info',
    async () => {
      const { data } = await authRequest.post(`/consumer/onboarding/info`);
      return data;
    },
    option
  );
};

export const useRightsToken = (option?: UseQueryOptions<IRightsTokenInfo>) => {
  return useQuery<IRightsTokenInfo>('/user/getSettingFlagRightsTokenDailyReport', getRightsTokenInfo, option);
};

export const ETHSwap = async (request: any): Promise<any> => {
  const { data } = await authRequest.post(`/bb/swapFunction`, request);
  return data;
};

export const useUser = (option?: UseQueryOptions<boolean, Error>) => {
  const { data, ...rest } = useQuery<boolean, Error>('me', getMe, {
    // enabled: false,
    refetchOnMount: true,
    // initialData: parseJson(getCookies(USER_COOKIES.userAccessToken)) as any,
    // onSuccess: (data) => setCookies(USER_COOKIES.user, JSON.stringify(data)),
    onError: () => {
      // removeCookies(USER_COOKIES.userAccessToken);
    },
    ...option,
  });
  return { user: data, ...rest };
};
