import HistoryPage from 'modules/HistoryPage';
import { GetServerSidePropsContext } from 'next';
import { preFetchSSR } from 'utils/auth';

export default HistoryPage;

export function getServerSideProps(ctx: GetServerSidePropsContext) {
  return preFetchSSR(ctx);
}
