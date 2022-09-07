import { request } from 'api/axios';
import { useQuery } from 'react-query';

export function usePairListQuery(options?: any) {
  return useQuery(
    '/bb/symbol/list',
    async () => {
      const { data } = await request.post('/bb/symbol/list');
      return data.pairs;
    },
    options
  );
}
