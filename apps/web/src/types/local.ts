export interface ICurrentCurrency {
  coinType: string;
  rate: string;
  symbol: string;
}
export interface IUserInfo {
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
}
export interface IUserAuth {
  totalAssessment: string;
  planType: string;
  accountIdHex: string;
  regRewardFlag: string;
  autoLockType: string;
  mineTrade: string;
  phone_verify: string;
  rechargeType: string;
  user: IUserInfo;
  emailState: string;
  'google-auth': string;
}
