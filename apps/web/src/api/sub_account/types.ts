export interface TListSubAccount {
  account: string;
  accountId: string;
  parentAccountId?: string;
  nickName: string;
}

export interface TRequestDeleteSub {
  deleteAccountId: string;
}

export interface TRequestCreateSub {
  subAccountName: string;
}

export interface TRequestTransfer {
  sourceAccount: string;
  targetAccount: string;
  coin: string;
  amount: string;
}

export interface TRequestChangeSub {
  subAccountName: string;
  subAccountId: string;
}
export interface TRequestCoinSub {
  accountId?: string;
}

export interface WalletTableItem {
  coinType: string;
  totalNumber: string;
  lockNumber: string;
  number: string;
  assessment: string;
}
export interface WalletGroupItem {
  coins: Array<WalletTableItem>;
  assessment: string;
  coinsLimitMap: Object;
}

export interface SubAccountItem {
  account: string;
  accountId: string;
  accountIdHex: string;
  nickName: string;
  parentAccountId: string;
}
