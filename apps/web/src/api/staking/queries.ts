import { request } from 'api/axios';
import { useQuery, UseQueryOptions } from 'react-query';
import { IUserStakingInfo } from '.';
import { getAutoCompoundFlag, getUserStakingInfoRequest } from './request';
import { IStakingAmount, ILockedInfo, IListStakingInfo, IAutoCompoundFlag } from './types';

export const useStakingAmount = (options?: UseQueryOptions<IStakingAmount>) => {
  return useQuery<IStakingAmount>(
    '/user/mine/getStakingAmount',
    async () => {
      const { data } = await request('/user/mine/getStakingAmount');
      return data;
    },
    options
  );
};

export const useLockedAmount = (options?: UseQueryOptions<ILockedInfo>) => {
  return useQuery<ILockedInfo>(
    '/user/mine/lockInfo',
    async () => {
      const { data } = await request.post('/user/mine/lockinfo');
      return data;
    },
    options
  );
};

export const useListStakingInfo = (options?: UseQueryOptions<IListStakingInfo>) => {
  return useQuery<IListStakingInfo>(
    '/mine/setting/stake',
    async () => {
      const { data } = await request('/mine/setting/stake');
      return data;
    },
    options
  );
};
export const useUserStakingInfo = (
  type: 'staking' | 'earning' | 'all',
  options?: UseQueryOptions<IUserStakingInfo>
) => {
  return useQuery<IUserStakingInfo>(
    ['/mine/getBalanceAndTokenStaking', type],
    () => getUserStakingInfoRequest(type),
    options
  );
};

export const useAutoCompoundFlag = (options?: UseQueryOptions<IAutoCompoundFlag>) => {
  return useQuery<IAutoCompoundFlag>('/mine/get-auto-compound', getAutoCompoundFlag, options);
};
