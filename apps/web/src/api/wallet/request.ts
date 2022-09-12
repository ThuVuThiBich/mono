import { request } from 'api/axios';
import axios from 'axios';
import { apiBaseUrl } from 'utils/constant';
import {
  WalletGroupItem,
  IWithdrawAddress,
  ISendWithdrawEmailParams,
  IChainSupported,
  IConvertCoinParams,
  IConvertCoinInfo,
  IGetWithdrawEmailParams,
} from './types';

export const getWalletQuery = async (): Promise<WalletGroupItem> => {
  const { data } = await request.post(`/bb/asset/show`);
  return data;
};

export const addWithdrawAddessRequest = async (params: {
  type: string;
  address: string;
  remark: string;
}): Promise<any> => {
  const { data } = await request.post(`/user/asset/withdraw/newaddress`, params);
  return data;
};

export const getAllWithdrawAddressRequest = async (params: { coin_type: string }): Promise<IWithdrawAddress> => {
  const { data } = await request.post(`/user/asset/withdraw/address`, params);
  return data;
};

export const sendWithDrawEmailRequest = async (params: ISendWithdrawEmailParams): Promise<any> => {
  const { data } = await request.post(`/user/assets/confirm-withdrawal-on-network`, params);
  return data;
};

export const getWithDrawEmailCodeRequest = async (params: IGetWithdrawEmailParams): Promise<any> => {
  const { data } = await request.post(`/user/assets/get-withdrawal-code`, params);
  return data;
};

export const confirmWithdrawRequest = async (params: {
  order_id: string;
  account: string;
  type: string;
}): Promise<any> => {
  const { data } = await request.post(`/user/asset/withdraw/confirm`, params);
  return data;
};

export const removeWithdrawAddressRequest = async (params: { type: string; index: number }) => {
  const { data } = await request.post(`/asset/remove/withdraw/address`, params);
  return data;
};

export const getSupportChainRequest = async (coin: string): Promise<IChainSupported> => {
  const { data } = await axios.post(apiBaseUrl + `/dpwd-information/finance/support-chain/${coin}`);
  return data;
};

export const getConvertCoinInfoRequest = async (params: IConvertCoinParams): Promise<IConvertCoinInfo> => {
  const { data } = await request.post(`/bb/get/convertCoin`, params);
  return data;
};

export const getConvertCoinList = async (): Promise<string[]> => {
  const { data } = await request.post(`bb/get/convertCoinList`);
  return data;
};

export const convertCoinRequest = async (params: IConvertCoinParams): Promise<any> => {
  const { data } = await request.post(`bb/convert/coin`, params);
  return data;
};

export const getStableCoinRequest = async (): Promise<string[]> => {
  const { data } = await axios.get(apiBaseUrl + `/dpwd-information/finance/stable-coins`);
  return data;
};
