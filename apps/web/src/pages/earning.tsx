import EarningPortfolioPage from 'modules/EarningPortfolioPage';
import { GetServerSidePropsContext } from 'next';
import { preFetchSSR } from 'utils/auth';

export default EarningPortfolioPage;

export function getServerSideProps(ctx: GetServerSidePropsContext) {
  return preFetchSSR(ctx);
}
