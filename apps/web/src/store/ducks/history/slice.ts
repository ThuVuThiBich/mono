import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { THistoryData, THistoryPageInfo, TRequestHistory, TTradeHistory } from 'api/history';
import { RootState } from 'store';

export interface THistoryReducer {
  orderHistoryList: THistoryData[];
  tradeHistoryList: TTradeHistory[];
  isLoadingHistory: boolean;
  pageInfo: THistoryPageInfo;
  pages: TRequestHistory;
}

export const PAGE_SIZE = 10;

const initialState = {
  orderHistoryList: [],
  tradeHistoryList: [],
  isLoadingHistory: false,
  pageInfo: {},
  pages: {
    symbol: '',
    type: 0,
    state: '',
    start_time: 0,
    end_time: 0,
    order_id: '',
    page: 1,
    page_size: PAGE_SIZE,
    sort: '',
    columnSort: '',
  },
} as THistoryReducer;

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setOrderHistory(state, action: PayloadAction<any>) {
      return {
        ...state,
        orderHistoryList: action.payload,
      };
    },
    setTradeHistory(state, action: PayloadAction<any>) {
      return {
        ...state,
        tradeHistoryList: action.payload,
      };
    },
    setIsLoadingHistory(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        isLoadingHistory: action.payload,
      };
    },
    setPageInfo(state, action: PayloadAction<any>) {
      return {
        ...state,
        pageInfo: action.payload,
      };
    },
    setPages(state, action: PayloadAction<TRequestHistory>) {
      return {
        ...state,
        pages: action.payload,
      };
    },
  },
});

export const getHistory = (state: RootState): THistoryReducer => state.history;
export const getPages = (state: RootState) => state.history.pages;

export const { setOrderHistory, setIsLoadingHistory, setPageInfo, setTradeHistory, setPages } = historySlice.actions;

export default historySlice.reducer;
