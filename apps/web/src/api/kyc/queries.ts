import { useQuery, UseQueryOptions } from 'react-query';
import { authRequest } from 'api/axios';
import { TGetReferralInfoRequest, TGetReferralInfoResponse } from './types';

export const useReferralInfo = (params: TGetReferralInfoRequest, options?: UseQueryOptions<any>) => {
  return useQuery<TGetReferralInfoResponse>(
    ['referral', 'info'],
    async () => {
      const { data } = await authRequest.post(`/skipid/user/referral/info`, params);
      return data;
    },
    options
  );
};
