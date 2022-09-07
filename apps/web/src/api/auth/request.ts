import { authRequest, request } from 'api/axios';
import { TCodeRequest, TLoginRequest, TRegisterRequest, TTokenResponse } from './types';

export const getAuthToken = async (): Promise<any> => {
  const { data } = await authRequest.post(`/consumer/gain/authToken`);
  return data;
};

export const getToken = async (): Promise<TTokenResponse> => {
  const { data } = await request.get('/index');
  return data;
};

export const getCode = async (params: TCodeRequest): Promise<any> => {
  const { data } = await request.post('/consumer/register/code', params);
  return data;
};

export const register = async (params: TRegisterRequest): Promise<any> => {
  const { data } = await request.post('/consumer/register', params);
  return data;
};

export const login = async (params: TLoginRequest): Promise<any> => {
  const { data } = await request.post('/consumer/conduct/verification', params);
  return data;
};

export const logout = async (): Promise<any> => {
  const { data } = await request.post('/consumer/signOut');
  return data;
};
