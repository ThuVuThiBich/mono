/* eslint-disable no-undef */
import type { CompletePrivateRouteInfo } from 'next/dist/shared/lib/router/router';
import type { Router } from 'next/dist/client/router';
import type { NextPage, NextComponentType } from 'next';

declare module 'next/app' {
  export declare type AppProps = Pick<CompletePrivateRouteInfo, 'Component' | 'err'> & {
    router: Router;
  } & Record<string, any> & {
      Component: {
        getLayout?: (page: JSX.Element) => JSX.Element;
      };
    };
}

declare module 'next' {
  export declare type PageComponent<P = unknown, IP = P> = NextPage<P, IP> & {
    getLayout: (component: NextComponentType) => JSX.Element;
  };
}
