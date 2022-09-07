import { useQuery, UseQueryOptions } from 'react-query';
import {
  getRewardTableRequest,
  getLevelSummaryTable,
  getReferalInvitationHistory,
  getEarningReferralHistory,
  getRewardRate,
} from './request';

import {
  IRewardTable,
  ILevelSummaryTable,
  IReferralInvitationHistory,
  IEarningHistoryParams,
  IEarningReferralHistory,
  IRewardRate,
} from './types';

export const useRewardTable = (options?: UseQueryOptions<IRewardTable[]>) => {
  return useQuery<IRewardTable[]>('/consumer/user_reward_table', getRewardTableRequest, options);
};

export const useLevelSummaryTable = (options?: UseQueryOptions<ILevelSummaryTable[]>) => {
  return useQuery<ILevelSummaryTable[]>('/consumer/level_summary_table', getLevelSummaryTable, options);
};

export const useReferralInvitation = (options?: UseQueryOptions<IReferralInvitationHistory>) => {
  return useQuery<IReferralInvitationHistory>(['/consumer/referrals'], () => getReferalInvitationHistory(), options);
};

export const useEarningReferralHistory = (
  params: IEarningHistoryParams,
  options?: UseQueryOptions<IEarningReferralHistory>
) => {
  return useQuery<IEarningReferralHistory>(
    ['/user/referral/history', params],
    () => getEarningReferralHistory(params),
    options
  );
};

export const useRewardRate = (options?: UseQueryOptions<IRewardRate>) => {
  return useQuery<IRewardRate>('/user/getRewardRate', getRewardRate, options);
};
