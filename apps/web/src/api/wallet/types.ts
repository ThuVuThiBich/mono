export interface WalletTableItem {
  coinType: string;
  totalNumber: string;
  lockNumber: string;
  number: string;
  assessment: string;
  rechargeGray: number;
  withdrawGray: number;
}
export interface WalletGroupItem {
  coins: Array<WalletTableItem>;
  assessment: string;
  coinsLimitMap: Object;
  pageInfo: Object;
  pieInfoList: {
    coinName: string;
    proportion: string;
    usdtName: string;
  }[];
}

export interface IDepositAddress {
  address: string;
  'special-chain-nom'?: string;
}

export interface IWithdrawAddress {
  googleStatus: number;
  address: {
    accountId: string;
    address: string;
    addressIndex: number;
    coinType: number;
    insertTime: number;
    remark: string;
  }[];
  capitalPwdStatus: number;
}

export interface IMinimalWithdrawCoin {
  Level: string;
  coinBigNum: string;
  coinBigNumCard: string;
  coinLimitMin: string;
  coinType: string;
  num: string;
}
export interface IWithdrawFee {
  number: string;
  fee: string;
  fee_coin: '0';
}

export interface ISendWithdrawEmailParams {
  coin: string;
  number: string;
  'target-address': string;
  memo?: string;
  chain?: any;
  'lang-type': number;
  '2fa-code'?: string;
  'email-code'?: string;
}

export interface IGetWithdrawEmailParams {
  coin: string;
  number: string;
  'target-address': string;
  memo?: string;
  chain?: any;
  'lang-type': number;
}

export interface IWithdrawOrderInfo {
  withdrawOrder: {
    account: string;
    address: string;
    coin: string;
    fee: string;
    feeCoin: string;
    languageType: number;
    number: string;
    orderId: string;
    status: string;
    time: string;
    webCost: string;
    webReplayTime: string;
  };
  pair: string;
}

export type IChainSupported = Record<
  string,
  {
    min: number;
    fee: number;
    decimals: number;
  }
>;

export interface IConvertCoinInfo {
  coinSendUserSubRate: string;
  rateConfig: string;
  fee: string;
  feeDisplay: string;
  toCoinPrice: string;
  totalPriceFromCoinToUSDT: string;
  coinSendUserNotSubRate: string;
}

export interface IConvertCoinParams {
  fromCoin: string;
  toCoin: string;
  fromCoinNumber: any;
}
