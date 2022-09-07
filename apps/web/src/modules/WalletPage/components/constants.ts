export const getNetworkInfo = (network: string) => {
  switch (network) {
    case 'eth':
      return { arrive: 12, unlock: 12, label: 'Ethereum (ERC20)' };
    case 'btc':
      return { arrive: 2, unlock: 2, label: 'Bitcoin (BTC)' };
    case 'bnb':
      return { arrive: 15, unlock: 15, label: 'Binance Chain (BEP2)' };
    case 'polygon':
      return { arrive: 128, unlock: 128, label: 'Polygon (MATIC)' };
    case 'xrp':
      return { arrive: 1, unlock: 1, label: 'Ripple (XRP)' };
    case 'ada':
      return { arrive: 30, unlock: 30, label: 'Cardano (ADA)' };
    case 'sol':
      return { arrive: 1, unlock: 1, label: 'Solana (SOL)' };
    case 'bsc':
      return { arrive: 15, unlock: 15, label: 'BNB Smart Chain (BEP20)' };
    case 'ltc':
      return { arrive: 4, unlock: 4, label: 'Litecoin (LTC)' };
    case 'bch':
      return { arrive: 6, unlock: 6, label: 'Bitcoin Cash (BCH)' };
    case 'xtz':
      return { arrive: 10, unlock: 10, label: 'Tezos (XTZ)' };
    case 'xlm':
      return { arrive: 1, unlock: 1, label: 'Stellar Lumens (XLM)' };
    case 'iost':
      return { arrive: 80, unlock: 80, label: 'IOST (IOST)' };
    case 'avax':
      return { arrive: 12, unlock: 12, label: 'Avalanche C-Chain (AVAX-C ARC20)' };
    case 'tron':
      return { arrive: 1, unlock: 1, label: 'Tron (TRC20)' };
    case 'cosmos':
      return { arrive: 15, unlock: 15, label: 'Cosmos Hub (ATOM)' };
    case 'doge':
      return { arrive: 50, unlock: 50, label: 'DOGE Chain (DOGE)' };
    case 'ftm':
      return { arrive: 5, unlock: 5, label: 'Fantom (FTM)' };
    case 'polkadot':
      return { arrive: 25, unlock: 25, label: 'Polkadot (DOT)' };
    case 'iotex':
      return { arrive: 16, unlock: 16, label: 'IoTeX (IOTX)' };
    case 'avax-xchain':
      return { arrive: 3, unlock: 3, label: 'Avalanche X-Chain (AVAX-X)' };
    case 'terra':
      return { arrive: 3, unlock: 3, label: 'LUNA - Terra' };
    case 'terra-classic':
      return { arrive: 3, unlock: 3, label: 'LUNC - Terra Classic' };
    default:
      return { arrive: 15, unlock: 15, label: network };
  }
};

export const needMemoChain = ['xrp', 'xlm', 'iost', 'cosmos', 'terra', 'terra-classic'];
export const DEPOSIT_COIN_NEED_ADDRESS_WARNING = ['USDT', 'USDC'];
export const WITHDRAW_COIN_NEED_ADDRESS_WARNING = ['USDT'];
export const ADDRESS_WARNING: Record<string, string> = {
  USDT: '95118',
  USDC: '48a6e',
};
