import { request } from 'api/axios';
import {
  IUnlockStakingParams,
  ILockedStakingParams,
  IUserStakingInfo,
  IStakingParams,
  IAutoCompoundFlag,
  IAutoCompoundParam,
} from './types';

export const stakeRequest = async (params: ILockedStakingParams) => {
  const { data } = await request({
    method: 'POST',
    url: '/user/mine/locked',
    data: params,
  });

  return data;
};

export const unlockStakingRequest = async (params: IUnlockStakingParams) => {
  const { data } = await request({
    method: 'POST',
    url: '/user/mine/unlockStaking',
    data: params,
  });

  return data;
};

export const stakingRequest = async (params: IStakingParams) => {
  return request({
    method: 'POST',
    url: '/user/mine/locked',
    data: params,
  });
};

export const getUserStakingInfoRequest = async (type: 'staking' | 'earning' | 'all'): Promise<IUserStakingInfo> => {
  let params = {
    status: '1',
    orderType: '3',
  };

  if (type === 'earning') {
    params = {
      status: '1,2,4',
      orderType: '2001,2002,2003',
    };
  }
  if (type === 'all') {
    params = {
      status: '1,2,4',
      orderType: '3,2001,2002,2003',
    };
  }

  const { data } = await request.post(`/mine/getBalanceAndTokenStaking`, params);
  return data;
};

export const getAutoCompoundFlag = async (): Promise<IAutoCompoundFlag> => {
  const { data } = await request({
    method: 'POST',
    url: '/mine/get-auto-compound',
  });
  return data;
};

export const setFlagAutoCompound = async (params: IAutoCompoundParam) => {
  return await request({
    method: 'POST',
    url: '/mine/auto-compound',
    data: params,
  });
};
