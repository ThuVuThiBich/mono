import ReferralPage from 'modules/ReferralPage';
import { GetServerSidePropsContext } from 'next';
import { preFetchSSR } from 'utils/auth';

export default ReferralPage;

export function getServerSideProps(ctx: GetServerSidePropsContext) {
  return preFetchSSR(ctx);
}
