import { authRequest } from 'api/axios';
import { useQuery, UseQueryOptions } from 'react-query';
import { SubAccountItem } from './types';

export function useSubAccountsQuery(options?: UseQueryOptions<SubAccountItem[]>) {
  return useQuery<SubAccountItem[]>(
    '/subAccount/getSubAccounts',
    async () => {
      const { data } = await authRequest.post('/subAccount/getSubAccounts');
      return data;
    },
    // { refetchOnWindowFocus: true, staleTime: 0, ...options }
    options
  );
}
