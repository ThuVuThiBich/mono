import AccountPage from 'modules/AccountPage';
import { GetServerSidePropsContext } from 'next';
import { preFetchSSR } from 'utils/auth';

export default AccountPage;

export function getServerSideProps(ctx: GetServerSidePropsContext) {
  return preFetchSSR(ctx);
}
