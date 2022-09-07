export const __prod__ = process.env.NODE_ENV === 'production';
export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
export const simplexCheckoutUrl = process.env.NEXT_PUBLIC_SIMPLEX_CHECKOUT_URL!;
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ultorex.org';
export const apiDealingUrl = 'http://172.16.3.210:8081';
export const isServer = () => typeof window === 'undefined';
export const isProd = baseUrl === 'https://ultorex.io';

export const AUTH0_CLIENT_ID = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
export const WEB_SOCKET_URL = process.env.NEXT_PUBLIC_WEB_SOCKET_URL!;

export const USER_COOKIES = {
  language: 'i18nextLng',
  currentCurrency: 'current-currency',
  auth0Cache: `@@auth0spajs@@::${AUTH0_CLIENT_ID}::https://skipid.net::openid profile email`,
  currentPair: 'currentPair',
  watchPairs: 'watchPairs',
  resolution: 'resolution', // Tradingview resolution
  subAccount: 'subaccount',
  maintenance: 'maintenance',
  comingSoon: 'comingSoon',
  userAccessToken: 'userAccessToken',
};

export const initialCurrentCurrency = {
  coinType: 'USD',
  rate: '1',
  symbol: '$',
};

export const LANGUAGE = [
  {
    label: 'English',
    value: 'en',
  },
  {
    label: 'Turkish',
    value: 'tr',
  },
  // {
  //   label: 'Chinese',
  //   value: 'zh',
  // },
  {
    label: 'Simplified Chinese',
    value: 'zh-CN',
  },
  {
    label: 'Traditional Chinese',
    value: 'zh-TW',
  },
  {
    label: 'Korean',
    value: 'ko',
  },
];
export const DEFAULT_CURRENCY = 'USD';
export const ORDER_CANCELED = '4';
export const ORDER_COMPLETE = '3';
