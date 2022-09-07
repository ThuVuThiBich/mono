import { request } from 'api/axios';
import { TGGCodeRequest, TQRRequest } from './types';

export const getSecretKey = async (): Promise<any> => {
  const { data } = await request.post('/consumer/secretKey/googleAuth');
  return data;
};

export const getQR = async (params: TQRRequest): Promise<any> => {
  const data = await request.post(params.url);
  return data;
};

export const enable = async (params: TGGCodeRequest): Promise<any> => {
  const { data } = await request.post('/consumer/enable/googleAuth', params);
  return data;
};

export const enter = async (params: TGGCodeRequest): Promise<any> => {
  const { data } = await request.post('/consumer/googleAuthen', params);
  return data;
};

export const disable = async (): Promise<any> => {
  const { data } = await request.post('/consumer/enable/googleAuth');
  return data;
};
