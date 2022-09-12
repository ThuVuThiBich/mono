import { removeCookies } from '@cross/cookies';
import { routes } from 'types/routes';
import { USER_COOKIES } from './constant';

export const logout = async () => {
  removeCookies(USER_COOKIES.subAccount);
  removeCookies(USER_COOKIES.userAccessToken);
  window.location.href = routes.home;
};
