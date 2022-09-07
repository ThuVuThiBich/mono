export interface TOrderTableItem {
  amount: string;
  coinName: string;
  feeNumber: string;
  orderId: string;
  pair: string;
  price: string;
  sell: boolean;
  time: string;
  total: string;
  tradeId: string;
}

export interface TSuccessResponse {
  orders: Array<TOrderTableItem>;
  page: {
    countNumber: number;
    countPage: number;
    pageNumber: number;
    pageSize: number;
  };
}

export interface TRequestHistory {
  symbol?: string;
  type: 0 | 1 | 2;
  state?: string;
  start_time?: any;
  end_time?: any;
  order_id?: string;
  page: number;
  page_size: number;
  sort?: 'desc' | 'asc' | '';
  columnSort?: string;
}

export interface THistoryPageInfo {
  countNumber?: number;
  countPage?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface THistoryData {
  amount?: string;
  avgPrice?: string;
  limitPrice?: string;
  money?: string;
  orderId?: string;
  orderType?: string;
  pair?: string;
  price?: string;
  sell?: boolean;
  state?: number;
  time?: string;
  total?: string;
  tradeAmount?: string;
}
export interface TCancelOrder {
  order_id: string;
  type: number;
}

export interface TCancelAllOrder {
  demoFlag: number;
}

export interface TTradeHistory {
  amount?: string;
  coinName?: string;
  feeNumber?: string;
  orderId?: string;
  pair?: string;
  price?: string;
  sell?: boolean;
  total?: string;
  time?: string;
  tradeId?: string;
}

export interface IWalletHistory {
  accountId: string;
  address: string;
  coinType: string;
  logId: string;
  number: string;
  orderId: string;
  orderType: number;
  status: number;
  time: string;
  chain?: string;
  detail?: {
    date: string;
    number: string;
    account_id: string;
    address: string;
    coin_type: number;
    confirms?: string;
    txid?: string;
    type?: string;
    coinTypeStr?: string;
    order_id?: string;
    last_date: string;
    status: any;
  };
}

export interface IWalletHistoryResponse {
  list: IWalletHistory[];
  page: {
    countNumber: number;
    countPage: number;
    pageNumber: number;
    pageSize: number;
  };
}

export interface IWalletHistoryParams {
  coin_type: string | 'ALL';
  type: number;
  page: number;
  page_size: number;
  startTime?: any;
  endTime?: any;
  sort?: 'desc' | 'asc' | '';
  columnSort?: string;
}

export interface IWalletHistoryExportParams {
  utc: any;
  typeStr: string;
  title: any;
  statusStr: string;
  coinType?: string;
  type?: number;
  startTime?: any;
  endTime?: any;
}
export interface ITradeHistoryExportParams {
  utc?: any;
  pair?: any;
  order_type?: any;
  start_time?: any;
  end_time?: any;
  order_id?: any;
  title?: any;
  sellStr?: any;
}
export interface IOrderHistoryExportParams {
  pair?: any;
  order_type?: any;
  order_state?: any;
  start_time?: any;
  end_time?: any;
  order_id?: any;
  title?: any;
  sellStr?: any;
  stateStr?: any;
  utc?: any;
}
