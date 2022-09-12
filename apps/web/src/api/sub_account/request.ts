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

export const createSubAccount = async (request: TRequestCreateSub): Promise<any> => {
  const { data } = await request.post(`/subAccount/create`, request);
  return data;
};

export const getSubAccounts = async (): Promise<TListSubAccount[]> => {
  const { data } = await request.post(`/subAccount/getSubAccounts`);
  return data;
};

export const deleteSubAccount = async (request: TRequestDeleteSub): Promise<any> => {
  const { data } = await request.post(`/subAccount/remove`, request);
  return data;
};

export const transferBetweenSub = async (request: TRequestTransfer): Promise<any> => {
  const { data } = await request.post(`/subAccount/asset/transfer`, request);
  return data;
};
export const changeNameSubAcc = async (request: TRequestChangeSub): Promise<any> => {
  const { data } = await request.post(`/subAccount/update`, request);
  return data;
};
export const getCoinsWithSubAccount = async (request: TRequestCoinSub): Promise<WalletGroupItem> => {
  const { data } = await request.post(`/bb/asset/show/account`, request);
  return data;
};
