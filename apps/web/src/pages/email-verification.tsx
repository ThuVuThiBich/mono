import { getCookies } from '@cross/cookies';
import EmailVerificationPage from 'modules/EmailVerificationPage';
import { GetServerSidePropsContext } from 'next';
import { USER_COOKIES } from 'utils/constant';
export default EmailVerificationPage;

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
