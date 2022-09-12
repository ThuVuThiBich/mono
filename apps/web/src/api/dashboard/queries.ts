import { useQuery, UseQueryOptions } from 'react-query';
import { request } from 'api/axios';
import { TReferralRankResponse, TReferralCountResponse, TUserPnlResponse } from './types';

export const useReferralRank = (options?: UseQueryOptions<TReferralRankResponse>) => {
  return useQuery<TReferralRankResponse>(
    '/consumer/referral_rank',
    async () => {
      const { data } = await request.post(`/consumer/referral_rank`);
      return data;
    },
    options
  );
};

export const useReferralCount = (options?: UseQueryOptions<any>) => {
  return useQuery<TReferralCountResponse>(
    '/consumer/referrals/new_count',
    async () => {
      const { data } = await request.post(`/consumer/referrals/new_count`);
      return data;
    },
    options
  );
};

export const useUserPnl = (options?: UseQueryOptions<TUserPnlResponse>) => {
  return useQuery<TUserPnlResponse>(
    '/user/assets/pnl',
    async () => {
      const { data } = await request.post(`/user/assets/pnl`);
      return data;
    },
    options
  );
};
