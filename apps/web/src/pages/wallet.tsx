import WalletPage from 'modules/WalletPage';
import { GetServerSidePropsContext } from 'next';
import { preFetchSSR } from 'utils/auth';

export default WalletPage;

export function getServerSideProps(ctx: GetServerSidePropsContext) {
  return preFetchSSR(ctx);
}
