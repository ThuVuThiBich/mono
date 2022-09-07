export interface TReferralRankResponse {
  amount: string;
  lv: string;
  max: string;
  min: string;
}

export interface TReferralCountResponse {
  kyc_count: string;
  qualified_count: string;
  registration_only_count: string;
}

export interface TUserPnlResponse {
  assetBeforeDayYesterDay: string;
  assetYesterday: string;
  percent: number;
  time: string;
}
