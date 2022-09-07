import { MarketGroupItem } from './types';
import { request } from 'api/axios';
import axios from 'axios';
import { apiBaseUrl } from 'utils/constant';

export const getMarketQuery = async (): Promise<MarketGroupItem[]> => {
  const { data } = await request.post('/bb/symbol/market/group');
  return data.bbMarketList;
};

export const getMarketQuerySSR = async (): Promise<MarketGroupItem[]> => {
  const { data } = await axios.post(apiBaseUrl + '/bb/symbol/market/group');
  return data?.data?.bbMarketList;
};
