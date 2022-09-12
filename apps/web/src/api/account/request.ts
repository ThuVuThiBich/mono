import { getCookies } from './../../../../../packages/cookies/cookies';
import { request } from 'api/axios';
import {
  TChangeNickName,
  TChangeNickNameResponse,
  TCreditLimit,
  TUserWithdrawnLimit,
  IRightsTokenInfo,
  TGetUserInfoResponse,
} from './types';
import axios from 'axios';
import { apiBaseUrl, USER_COOKIES } from 'utils/constant';

export const changeNickName = async (request: TChangeNickName): Promise<TChangeNickNameResponse> => {
  const { data } = await request.post(`/consumer/edit/nickName`, request);
  return data;
};

export const getSkipIdInfo = async () => {
  const { data } = await request.post(`/skipid/user/info`);
  return data;
};

export const getSkipIdInfoSSR = async (token: string): Promise<TGetUserInfoResponse> => {
  const { data } = await axios({
    method: 'POST',
    url: `${apiBaseUrl}/skipid/user/info`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data?.data;
};

export const getUserWithdrawnLimit = async (): Promise<TUserWithdrawnLimit> => {
  const { data } = await request.post(`/user/assets/withdraw/limits`);
  return data;
};

export const getCreditLimit = async (fiat: string): Promise<TCreditLimit> => {
  const { data } = await request.post(`/credit/limit`, { type: 'WEB', fiat_currency: fiat });
  return data;
};

export const addFavorite = async (coin: string): Promise<any> => {
  return await request.post(`/user/favorite/add`, { coin_name: coin });
};

export const removeFavorite = async (coin: string): Promise<any> => {
  return await request.post(`/user/favorite/remove`, { coin_name: coin });
};

export const getListFavorite = async (): Promise<any> => {
  const { data } = await request.post(`/user/favorite/list`);
  return data;
};

export const changeAvatarRequest = async (file: File) => {
  const { data } = await request.post(`/skipid/user/avatar/url`);

  await axios.put(data.avatar_url, file, {
    headers: { 'Content-Type': file.type },
  });
  return await request.post(`/skipid/user/avatar/update`);
};

export const clearSiteCookie = async () => {
  return await axios({
    method: 'GET',
    url: '/api/clear-cookie',
    withCredentials: true,
  });
};

export const getRightsTokenInfo = async (): Promise<IRightsTokenInfo> => {
  const { data } = await request.post(`/user/getSettingFlagRightsTokenDailyReport`);
  return data;
};

export const toggleRightsTokenRequest = async (flag: boolean): Promise<any> => {
  const { data } = await request.post(`/user/updateSettingFlagRightsTokenDailyReport`, { flag: flag });
  return data;
};

export const unsubscribeEmail = async (params: {
  hexIdEncode: string;
  reason: string;
  otherFeedback: string;
}): Promise<any> => {
  const { data } = await request.post(`/user/activity/unsubscribe-email`, params);
  return data;
};

export const getMe = async () => {
  const { data } = await request.post(`/user/info`);
  // const token = getCookies(USER_COOKIES.userAccessToken);
  return data;
};
