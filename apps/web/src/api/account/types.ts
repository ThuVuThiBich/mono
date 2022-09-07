export interface CurrencyGroupItemResponse {
  coinType: any;
  rate: string;
  symbol?: string;
}

export interface TGetIndexResponse {
  token: string;
}

export interface TChangeNickName {
  nickName: string;
}

export interface TChangeNickNameResponse {
  user: {
    account: string;
    accountId: string;
    autoLockType: number;
    credit: number;
    defPool: number;
    direct: number;
    headImg: string;
    invitationUser: string;
    isLeverage: number;
    nickName: string;
    partnerCountSign: number;
    partnerId: string;
    phone: string;
    status: number;
  };
}

export interface TGetUserInfoRequest {
  sub: string;
}
export interface TGetUserInfoResponse {
  use_mfa: boolean;
  kyc_status: number;
}

export interface TGetCurrentCurrency {
  coinType: any;
  rate: number;
  symbol: string;
}

export interface TUserFinanceLimit {
  'buy-daily-limit': string | number;
  'buy-daily-remain': string | number;
  'buy-monthly-limit': string | number;
  'buy-monthly-remain': string | number;
  level: number;
  'sell-daily-limit': string | number;
  'sell-daily-remain': string | number;
  'sell-monthly-limit': string | number;
  'sell-monthly-remain': string | number;
}
export interface TUserWithdrawnLimit {
  Level: string;
  'daily-limit': string;
  'daily-remain': string;
  'monthly-limit': string;
  'monthly-remain': string;
}

export interface TCreditLimit {
  kycMaxLimit: number;
  kycMinLimit: number;
  maxLimit: number;
  minLimit: number;
}

export interface IOnboardInfo {
  depositCompletedFlg: number;
  mineCompletedFlg: number;
  rewardReceivedFlg: number;
}

export interface IRightsTokenInfo {
  RIGHTS_TOKEN: number;
  flag: any;
}

export interface IUser {
  email: string;
  token: string;
}
