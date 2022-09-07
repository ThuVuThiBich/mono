import { authRequest } from 'api/axios';
import {
  IRewardTable,
  ILevelSummaryTable,
  IEarningReferralHistory,
  IReferralInvitationHistory,
  IEarningHistoryParams,
  IRewardRate,
} from './types';

export const getRewardTableRequest = async (): Promise<IRewardTable[]> => {
  const { data } = await authRequest.post('/consumer/user_reward_table');
  return data;
};

export const getLevelSummaryTable = async (): Promise<ILevelSummaryTable[]> => {
  const { data } = await authRequest.post('/consumer/level_summary_table');
  return data;
};

export const getReferalInvitationHistory = async (): Promise<IReferralInvitationHistory> => {
  const { data } = await authRequest.post('/consumer/referrals');
  return data;
};

export const getEarningReferralHistory = async (params: IEarningHistoryParams): Promise<IEarningReferralHistory> => {
  const { data } = await authRequest.post('/user/referral/history', params);
  return data;
};

export const getRewardRate = async (): Promise<IRewardRate> => {
  const { data } = await authRequest.post('/user/getRewardRate');
  return data;
};

export const setShareRateRequest = async (rate: any): Promise<any> => {
  const { data } = await authRequest.post('/user/updateShareRate', { rate });
  return data;
};
