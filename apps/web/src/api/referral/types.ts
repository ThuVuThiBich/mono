export interface IRewardTable {
  min: string;
  max: string;
  rate: string;
  level: string;
}
export interface ILevelSummaryTable {
  kyc_count: string;
  amount: string;
  user_count: string;
  qualified_count: string;
  lv: string;
}

export interface IReferralHistoryParams {
  page: number;
  page_size?: number;
  startDate?: any;
  endDate?: any;
  name?: any;
  status?: string;
  type?: number | '';
}

export interface IEarningHistoryParams {
  page: number;
  page_size?: number;
  start_time?: any;
  end_time?: any;
  name?: any;
  status?: string;
  type?: number | '';
}

export interface IReferralInvitation {
  accountId: string;
  nickname: string;
  firstTrade: string;
  lastTrade: string;
  kycDate: string;
  registerDate: string;
  status: 'REGISTRATION_ONLY' | 'KYC_COMPLETED' | 'TRADE_OR_MINED';
}

export interface IReferralInvitationHistory {
  page: number;
  pageSize: number;
  referrals: IReferralInvitation[];
  totalKycRecord: number;
  totalPageCount: number;
  totalRecord: number;
  usersFee: any[];
}

export interface IEarningReferral {
  accountId: string;
  coinName: string;
  coinType: number;
  level: number;
  number: string;
  referralAccount: string;
  referralName: string;
  rewardRate: string;
  status: number;
  time: string;
}

export interface IEarningReferralHistory {
  pageInfo: {
    countNumber: number;
    countPage: number;
    pageNumber: number;
    pageSize: number;
  };
  referralRewardList: IEarningReferral[];
  totalEarning: string;
  totalEarningBTC: string;
  pnl: {
    assetBeforeDayYesterDay: string;
    assetYesterday: string;
    percent: any;
    time: any;
  };
}

export interface IRewardRate {
  mine: string;
  shareRate: string;
}
