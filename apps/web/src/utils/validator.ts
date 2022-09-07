import { message } from 'antd';
import { TListSubAccount } from 'api/sub_account';
import { TFunction } from 'next-i18next';

export const phoneNumberRule = (value: any, t: TFunction) => {
  if (!value || value.length === 0) return Promise.resolve('');

  if (isNaN(value)) {
    return Promise.reject(t('e_ERROR_TYPE_NUMBER', { ns: 'error' }));
  }

  if (value.length > 15) {
    return Promise.reject(t('e_ERROR_MAX_LENGTH', { ns: 'error', count: 15 }));
  }
  return Promise.resolve('');
};

export const subAccountNameRule = (value: any, listSubAccount: TListSubAccount[], t: TFunction) => {
  if (!value || value.length === 0) return Promise.resolve('');

  const regex = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

  if (regex.test(value)) {
    return Promise.reject(t('e_UNALLOWED_SPECIAL', { ns: 'error' }));
  }

  if (value.length > 15) {
    return Promise.reject(t('e_ERROR_MAX_LENGTH', { ns: 'error', count: 15 }));
  }

  if (
    value.toLowerCase().trim() === t('common.main_wallet').toLowerCase().trim() ||
    value.toLowerCase().trim() === t('sub_account.main_account').toLowerCase().trim()
  ) {
    return Promise.reject(t('*Name sub-account cannot be Main Account or Main Wallet', { ns: 'error' }));
  }
  if (listSubAccount.findIndex((x) => x.nickName === value) !== -1) {
    return Promise.reject(t('*duplicate subaccount name', { ns: 'error' }));
  }
  return Promise.resolve('');
};

export const nicknameRule = (value: any, t: TFunction) => {
  if (!value || value.length === 0) return Promise.resolve('');

  if (value.length > 30) {
    return Promise.reject(t('e_ERROR_MAX_LENGTH', { ns: 'error', count: 30 }));
  }

  return Promise.resolve('');
};

export const maxLengthRule = (length: number, t: TFunction) => {
  return {
    max: length,
    message: t('e_ERROR_MAX_LENGTH', { ns: 'error', count: length }),
  };
};

export const alphanumericalRule = (t: TFunction) => {
  return {
    pattern: new RegExp(/^[a-zA-Z0-9@~`!@#$%^&*(){}\[\]|\s_=+\\\\';:\"\\/?>.<,-]+$/i),
    message: t('e_ERROR_ALPHANUMERIACAL', { ns: 'error' }),
  };
};

export const fileChangeValidator = async (file: File, maxSize = 4, t: TFunction) => {
  return new Promise((resolve, reject) => {
    if (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      if (!isJpgOrPng) {
        message.error(t('e_IMAGE_TYPE', { ns: 'error' }));
        return reject('Invalid file type');
      }
      const isLt5M = (file.size as number) / 1024 / 1024 < maxSize;
      if (!isLt5M) {
        message.error(t('e_IMAGE_SIZE', { ns: 'error', size: maxSize }));
        return reject('Invalid file size');
      }
    }
    return resolve('File valid');
  });
};

export const validateEmail = (email: string) => {
  return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
};

export const validatePassword = (password: string) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
};
