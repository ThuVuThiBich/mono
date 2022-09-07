import { setCookies } from '@cross/cookies';
import { getPairList } from 'api/exchange/request';
import ExchangePage from 'modules/ExchangePage';
import { GetServerSidePropsContext } from 'next';
import { setCookie } from 'nookies';
import { dehydrate, QueryClient } from 'react-query';
import { USER_COOKIES } from 'utils/constant';
export default ExchangePage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  //   const session = getSession(ctx.req, ctx.res);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery('/bb/symbol/list', getPairList);
  const fetchedPairs = queryClient.getQueryData('/bb/symbol/list') as any[];

  const pair = ctx.query.id as string;

  if (fetchedPairs && pair) {
    const isExist = fetchedPairs.find((x) => x[0] === pair.toUpperCase());
    if (isExist) {
      setCookie(ctx, USER_COOKIES.currentPair, isExist[0], { maxAge: 30 * 24 * 60 * 60, path: '/' });
    } else {
      const pairSelected = fetchedPairs?.[0]?.[0] ? fetchedPairs[0][0] : 'BTC_USDT';
      setCookie(ctx, USER_COOKIES.currentPair, pair, { maxAge: 30 * 24 * 60 * 60, path: '/' });
      if (pairSelected !== pair) {
        return {
          redirect: {
            permanent: true,
            destination: `/exchange/${pairSelected}`,
          },
        };
      }
    }
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      //   user: session?.user || null,
    },
  };
}
