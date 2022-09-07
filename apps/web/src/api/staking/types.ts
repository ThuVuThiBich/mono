export interface IStakingAmount {
  stakingAmount: string;
}

export interface ILockerOrder {
  number: string;
  numberRoot?: string;
  orderId: string;
  orderTime: string;
  coinName: string;
  period: string;
  rate: string;
  apy: string;
  status: number;
  min: string;
  type: 3 | 2001 | 2002 | 2003 | 2999; //2999 === stake XCRS 3 === staking, 2001 = earning_30,...
  unlockTime: string;
  reward?: any;
}

export interface ILockedInfo {
  limit: string;
  lockOrders: ILockerOrder[];
  lockPlans: {
    period: string;
    rate: string;
    slockOpen: string;
    type: number;
  }[];
  pageInfo: {
    countNumber: number;
    countPage: number;
    pageNumber: number;
    pageSize: number;
  };
  totalBit: string;
  totalLocked: string;
}

export interface ILockedStakingParams {
  type: number;
  num: number;
}
export interface IUnlockStakingParams {
  number: number;
  orderId: string;
  coinName: string;
  type?: any;
}

export interface IStakingInfo {
  apy: string;
  min: string;
  rate: string;
  time: number;
  timeUnstakeAsset: number;
  timeUnstakeReward: number;
  individualMaxLimit?: number;
  overallMaxLimit?: number;
  type: 3 | 2001 | 2002 | 2003 | 2999; //2999 === stake XCRS 3 === staking, 2001 = earning_30,...
  unstakeType: number;
  compoundFlag: boolean;
  periodBonusTime: number;
  startBonusTime: number;
  unstakeTime: number;
  minTimeAutoRelease: number;
  maxTimeAutoRelease: number;
}

export interface IListStakingInfo {
  [key: string]: IStakingInfo[];
}

export interface IStakingParams {
  type: number;
  num: string;
  coinName: string;
  timeAutoRelease?: any;
}

export interface IUserStakingInfo {
  lockedStakingBalanceBTC: number;
  numberToken: number;
  lockedStakingBalanceUSDT: number;
  pnl: {
    assetBeforeDayYesterDay: string;
    assetYesterday: string;
    percent: any;
    time: any;
  };
  [key: string]: any;
}

export type IAutoCompoundFlag = Record<string, boolean>;

export interface IAutoCompoundParam {
  coinName: string;
  flagAutoCompound: boolean;
}
