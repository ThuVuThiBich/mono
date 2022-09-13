import { getCookies } from '@cross/cookies';
import LoginPage from 'modules/LoginPage';
import { GetServerSidePropsContext } from 'next';
import { USER_COOKIES } from 'utils/constant';
export default LoginPage;

export function getServerSideProps(ctx: GetServerSidePropsContext) {
  const token = getCookies(USER_COOKIES.userAccessToken, ctx);
  if (token) {
    return {
      redirect: {
        permanent: false,
        destination: `/`,
      },
    };
  }
  return { props: { user: null } };
}
