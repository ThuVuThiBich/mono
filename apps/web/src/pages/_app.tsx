import 'styles/global.less';
import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';
import { AppProps } from 'next/app';
import CustomLayout from 'components/layout';
import { Provider } from 'react-redux';
import store from 'store';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useState } from 'react';

const queryClientOption = {
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false, staleTime: 1000 * 5 },
  },
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient(queryClientOption));

  return (
    <>
      <Head>
        <title>Ultorex - The ultimate exchange for the head runners</title>
      </Head>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <CustomLayout>
              <Component {...pageProps} />
            </CustomLayout>
          </Hydrate>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </>
  );
};

export default appWithTranslation(MyApp);
