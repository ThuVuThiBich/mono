import { request } from 'api/axios';
import { useQuery } from 'react-query';

export function usePairListQuery(params?: any) {
  return useQuery('/bb/symbol/list', async () => {
    const { data } = await request.post('/bb/symbol/list', params);
    return data.pairs;
  });
}
