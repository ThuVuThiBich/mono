import { TGetDigitalFiat, TGetDigitalCoin, TLimitFiat, ISimplexBuyInfo } from './types';
import { authRequest, request } from 'api/axios';

export const getDigitalCoin = async (params: TGetDigitalCoin): Promise<ISimplexBuyInfo> => {
  if (params.fiatAmount === 0) throw new Error('');

  const { data } = await authRequest.post('/payment/buy-price', params);
  return data;
};

export const getFiatCurrency = async (params: TGetDigitalFiat) => {
  const { data } = await request.post('/payment/sell-price', params);
  return data;
};

export const getLimitFiat = async (params: TLimitFiat) => {
  const { data } = await authRequest.post('/credit/limit', params);
  return data;
};
