export const inputProps = {
  maxImageFileSize: 4 * 1000 * 1000, // 4MB
  allowedImageContentType: ['image/jpeg', 'image/png'],
};

export const APR_COINS = ['ETH', 'AVAX', 'IOST', 'ATOM', 'IOTX'];
export const COIN_AUTO_COMPOUND = ['ORBS'];
export const HIDE_COIN_WITHDRAW: string[] = ['ETHS', 'ETHW'];
export const HIDE_COIN_DEPOSIT: string[] = ['ETHS', 'ETHW'];

export const APY_STAKING_RANGE: Record<string, string> = {
  ETH: '1.5% ~  3.5%',
  ADA: '2% ~ 5%',
  ATOM: '13% ~ 15%',
  AVAX: '7% ~ 8%',
  IOST: '2% ~ 3%',
  THETA: '~2%',
  SOL: '5% ~ 6%',
  IOTX: '~ 5%',
  ORBS: '~ 6.67%',
  XCR: '~ 1.77%',
};
