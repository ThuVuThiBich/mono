import { removeCookies } from '@cross/cookies';
import { clearSiteCookie } from 'api/account';
import { USER_COOKIES } from './constant';

export const logout = async () => {
  removeCookies(USER_COOKIES.subAccount);
  await clearSiteCookie();
  location.href = '/api/auth/logout';
};
