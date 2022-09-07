export interface ITickerSocket {
  data: {
    buy: string;
    dchange: string;
    dchange_pec: string;
    high: string;
    last: string;
    low: string;
    sell: string;
    timestamp: string;
    vol: string;
  };
  pair: string;
}

export interface UserProfile {
  email?: string | null;
  email_verified?: boolean | null;
  name?: string | null;
  nickname?: string | null;
  picture?: string | null;
  sub?: string | null;
  updated_at?: string | null;
  org_id?: string | null;
  [key: string]: unknown; // Any custom claim which could be in the profile
}

export type ObjectTypes = { [key: string]: string };

type IWallet = {
  assessment?: string;
  number?: string;
};

type IBorrow = {
  number: string;
  interest: string;
};

export interface TWallet {
  free: Record<string, IWallet>;
  freezed: ObjectTypes;
  borrow: Record<string, IBorrow>;
}