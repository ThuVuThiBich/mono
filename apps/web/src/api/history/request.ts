import { request } from 'api/axios';
import {
  TRequestHistory,
  TSuccessResponse,
  TCancelOrder,
  TCancelAllOrder,
  IWalletHistoryExportParams,
  ITradeHistoryExportParams,
  IOrderHistoryExportParams,
} from './types';

export const searchOrderHistory = async (request: TRequestHistory): Promise<TSuccessResponse> => {
  const { data } = await request.post(`/bb/market/order/order/history`, request);
  return data;
};

export const searchTradeHistory = async (request: TRequestHistory): Promise<TSuccessResponse> => {
  const { data } = await request.post(`/bb/market/order/trade/history`, request);
  return data;
};

export const cancelOrder = async (request: TCancelOrder) => {
  await request.post(`/bb/market/order/cancel-order`, request);
  return;
};

export const cancelAllOrder = async (request: TCancelAllOrder) => {
  await request.post(`/bb/market/order/cancel-all-order`, request);
  return;
};

export const getWalletHistoryFile = async (params: IWalletHistoryExportParams) => {
  const { data } = await request.post('/user/asset/walletHistory/excel', params);
  return data;
};

export const getOrderHistoryFile = async (params: IOrderHistoryExportParams) => {
  const { data } = await request.post('/bb/market/order/historyExcel', params);
  return data;
};

export const getTradeHistoryFile = async (params: ITradeHistoryExportParams) => {
  const { data } = await request.post('/bb/order/trade/historyExcel', params);
  return data;
};

export const historyWithdrawResendEmailRequest = async (params: { order_id: string; languageType: 2 | 5 }) => {
  const { data } = await request.post('/user/asset/withdraw/resendEmail', params);
  return data;
};
export const historyCancelWithdrawRequest = async (params: { order_id: string }) => {
  const { data } = await request.post('/user/asset/withdraw/web/cancle', params);
  return data;
};

export const emailCancelWithdrawRequest = async (params: { order_id: string }) => {
  const { data } = await request.post('/user/asset/withdraw/cancle', params);
  return data;
};
