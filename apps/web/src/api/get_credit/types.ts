export interface TGetDigitalCoin {
  digitalCurrency: string;
  fiatCurrency: string;
  fiatAmount: number;
  target: string;
}

export interface ISimplexBuyInfo {
  digital_money: {
    amount: string;
    currency: string;
  };
  fiat_money: {
    base_amount: string;
    currency: string;
    total_amount: string;
  };
  quote_id: string;
  supported_digital_currencies: string[];
  supported_fiat_currencies: string[];
  user_id: string;
  valid_until: string;
  wallet_id: string;
}

export interface TGetDigitalFiat {
  digitalCurrency: string;
  fiatCurrency: string;
  digitalAmount: number;
  target: string;
}

export interface TDigitalMoney {
  amount: string;
  currency: string;
}

export interface TFiatMoney {
  base_amount: string;
  currency: string;
  total_amount: string;
}

export interface TDigitalCoinItem {
  digital_money: TDigitalMoney;
  fiat_money: TFiatMoney;
  quote_id: TFiatMoney;
  supported_digital_currencies: string[];
  supported_fiat_currencies: string[];
  user_id: string;
  valid_until: string;
  wallet_id: string;
}

export interface TLimitFiat {
  type: string;
  fiat_currency: string;
}

export interface TResponseLimit {
  kycMaxLimit: string;
  kycMinLimit: string;
  maxLimit: string;
  minLimit: string;
}

export interface ICoingeckoParams {
  from?: string;
  to: string;
}

export interface ICoingecko {
  [key: string]: {
    [key: string]: number;
  };
}

export interface ICoingeckoId {
  id: string;
  symbol: string;
  name: string;
}

export interface IOrbsPrice {
  name: string;
  enabled: boolean;
  postOnly: boolean;
  priceIncrement: number;
  sizeIncrement: number;
  minProvideSize: number;
  last: number;
  bid: number;
  ask: number;
  price: number;
  type: string;
  baseCurrency: string;
  quoteCurrency: string;
  underlying: null;
  restricted: false;
  highLeverageFeeExempt: true;
  largeOrderThreshold: number;
  change1h: number;
  change24h: number;
  changeBod: number;
  quoteVolume24h: number;
  volumeUsd24h: number;
  priceHigh24h: number;
  priceLow24h: number;
}
