import { routes } from 'types/routes';

export const navigationRoutes = [
  {
    title: 'Trade',
    path: `${routes.exchange}/BTC_USDT`,
  },
  { title: 'Markets', path: routes.market },
  {
    title: 'Earn',
    subs: [
      { title: 'Staking', path: routes.stake },
      { title: 'ULT Earn', path: routes.ultEarn },
    ],
  },
  {
    title: 'Wallet',
    path: routes.wallet,
    auth: true,
  },
];
