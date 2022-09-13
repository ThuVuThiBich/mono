import { request } from 'api/axios';
import {
  TRequestChangeSub,
  TRequestCoinSub,
  TRequestCreateSub,
  TRequestDeleteSub,
  TRequestTransfer,
  WalletGroupItem,
  TListSubAccount,
} from './types';

export const createSubAccount = async (params: TRequestCreateSub): Promise<any> => {
  const { data } = await request.post(`/subAccount/create`, params);
  return data;
};

export const getSubAccounts = async (): Promise<TListSubAccount[]> => {
  const { data } = await request.post(`/subAccount/getSubAccounts`);
  return data;
};

export const deleteSubAccount = async (params: TRequestDeleteSub): Promise<any> => {
  const { data } = await request.post(`/subAccount/remove`, params);
  return data;
};

export const transferBetweenSub = async (params: TRequestTransfer): Promise<any> => {
  const { data } = await request.post(`/subAccount/asset/transfer`, params);
  return data;
};
export const changeNameSubAcc = async (params: TRequestChangeSub): Promise<any> => {
  const { data } = await request.post(`/subAccount/update`, params);
  return data;
};
