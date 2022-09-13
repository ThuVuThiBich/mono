import { getCookies, removeCookies } from '@cross/cookies';
import { GetServerSidePropsContext } from 'next';
import { routes } from 'types/routes';
import { USER_COOKIES } from './constant';

export const logout = async () => {
  removeCookies(USER_COOKIES.subAccount);
  removeCookies(USER_COOKIES.userAccessToken);
  window.location.href = routes.home;
};

export const preFetchSSR = (ctx: GetServerSidePropsContext) => {
  const token = getCookies(USER_COOKIES.userAccessToken, ctx);
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: `/login`,
      },
    };
  }
  return { props: { user: token } };
};
