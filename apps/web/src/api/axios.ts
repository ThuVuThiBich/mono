/* eslint-disable no-restricted-syntax */
import { getCookies, setCookies } from '@cross/cookies';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { i18n } from 'next-i18next';
import Router from 'next/router';
import { logout } from 'utils/auth';
import { apiBaseUrl, USER_COOKIES, __prod__ } from 'utils/constant';

const defaultErrorCode = 'error:e_ERROR';

export const request = axios.create({
  baseURL: apiBaseUrl,
});

const fileExportURL = [
  '/user/asset/walletHistory/excel',
  '/bb/market/order/historyExcel',
  '/bb/order/trade/historyExcel',
];

const fileURLs = ['/consumer/get/img'];

const handleSuccess = (res: AxiosResponse) => {
  // File export not return in data field
  if (fileURLs.includes(res.config.url as string)) {
    return res;
  }

  // File export not return in data field
  if (fileExportURL.includes(res.config.url as string)) {
    return res;
  }

  const statusCode = res.data?.code;

  if (statusCode !== 0 && statusCode !== -2) {
    let errorCode = `error:${res.data.msg_code}`;

    if (res?.data?.data?.cause) {
      errorCode = `error:${res?.data?.data?.cause}`;
    }
    // !Some request that return string instead of object
    if (typeof res.data !== 'object' && res.data !== 'disabled') {
      // res.data = { message: i18n?.t(defaultErrorCode) };
      res.data.message = errorCode;
    } else {
      // res.data.message = i18n?.exists(errorCode) ? i18n?.t(errorCode) : i18n?.t(defaultErrorCode);
      res.data.message = errorCode;
    }
    return Promise.reject(res.data);
  }
  // if (statusCode === -2) {
  //   removeCookies(USER_COOKIES.userAccessToken);
  //   router.push(routes.login);
  //   return Promise.reject(res.data);
  // }

  if (res.request) return res.data;
};

const handleError = async (err: AxiosError) => {
  const data = err?.response?.data as any;
  const errorCode = `error:${data?.msg_code}`;

  // Handle API Crash
  if (err.message === 'Network Error' && __prod__) {
    let isOnline = true;
    await fetch('//google.com', {
      mode: 'no-cors',
    }).catch(() => {
      isOnline = false;
    });
    if (isOnline) {
      setCookies(USER_COOKIES.maintenance, true);
      return Router.push('/maintenance');
    }
  }

  // Handle expired refresh token
  if (err.response?.status === 401 && err?.response?.data?.message === 'invalid_grant') {
    return logout();
  } else if (err.response?.status === 503) {
    setCookies(USER_COOKIES.maintenance, true);
    return Router.push('/maintenance');
  } else if (err.response?.status === 504) {
    return Router.push('/coming-soon');
  }

  if (data) {
    if (data.message) {
      data.message = i18n?.exists(errorCode) ? i18n?.t(errorCode) : i18n?.t(defaultErrorCode);
    } else {
      data.message = i18n?.t(defaultErrorCode);
    }
  }
  return Promise.reject(data);
};

request.interceptors.response.use(handleSuccess, handleError);

request.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    config = {
      ...config,
      data: convertToFormData(config.data),
      withCredentials: true,
    };

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

const convertToFormData = (data: { string: string }) => {
  const bodyFormData = new FormData();
  if (data) {
    for (const [key, value] of Object.entries(data)) {
      bodyFormData.append(key, value);
    }
  }
  const token = getCookies(USER_COOKIES.userAccessToken);
  if (token) {
    bodyFormData.append('token', token);
  }
  return bodyFormData;
};
