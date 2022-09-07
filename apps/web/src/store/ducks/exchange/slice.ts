import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';

export interface TExchangeReducer {
  orderBookSelect: any;
  listPairValue: any;
  currentPairValue: any;
  pairType: 'spot' | 'margin';
  dataDepth: {
    bids: { [key: number]: any[] };
    asks: { [key: number]: any[] };
    avgSum: number;
    maxBid: number;
    minAsk: number;
  };
  tradesData: {
    history: any[];
    lastPrice: number;
    lastPriceType: 1 | 2 | 3;
  };
  convertData: Array<any>[];
}

const initialState = {
  orderBookSelect: {},
  listPairValue: [],
  currentPairValue: null,
  pairType: 'spot',
  dataDepth: {
    bids: {},
    asks: {},
    avgSum: 0,
    maxBid: Math.max(),
    minAsk: Math.min(),
  },
  tradesData: {
    history: [],
    lastPrice: 0,
    lastPriceType: 1, // 1: not change, 2: increment, 3: decrement
  },
  convertData: [],
} as TExchangeReducer;

const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {
    setOrderBookSelect(state, action: PayloadAction<any>) {
      return {
        ...state,
        orderBookSelect: action.payload,
      };
    },
    setListPairValue(state, action: PayloadAction<any>) {
      return {
        ...state,
        listPairValue: action.payload,
      };
    },
    setCurrentPairValue(state, action: PayloadAction<any>) {
      let temp: any = [...action.payload];
      if (temp?.[2]) {
        temp[2] = parseInt(temp[2]);
      }
      if (temp?.[3]) {
        temp[3] = parseInt(temp[3]);
      }

      return {
        ...state,
        currentPairValue: temp,
      };
    },
    setPairType(state, action: PayloadAction<'spot' | 'margin'>) {
      return {
        ...state,
        pairType: action.payload,
      };
    },
    setDataDepth(state, action: PayloadAction<any>) {
      return {
        ...state,
        dataDepth: action.payload,
      };
    },
    setTradesData(state, action: PayloadAction<any>) {
      return {
        ...state,
        tradesData: action.payload,
      };
    },
    setConvertData(state, action: PayloadAction<any>) {
      return {
        ...state,
        convertData: action.payload,
      };
    },
  },
});

export const getExchange = (state: RootState): TExchangeReducer => state.exchange;
export const getOrderBookSelect = (state: RootState) => state.exchange.orderBookSelect;
export const getCurrentPairValue = (state: RootState) => state.exchange.currentPairValue;
export const getListPairValue = (state: RootState) => state.exchange.listPairValue;
export const getTradesData = (state: RootState) => state.exchange.tradesData;
export const getDataDepth = (state: RootState) => state.exchange.dataDepth;
export const getLastPriceType = (state: RootState) => state.exchange.tradesData?.lastPriceType || 1;
export const getLastTradePrice = (state: RootState) => state.exchange.tradesData.lastPrice || 0;
export const getPairType = (state: RootState) => state.exchange.pairType;
export const getConvertData = (state: RootState) => state.exchange.convertData;

export const {
  setOrderBookSelect,
  setListPairValue,
  setCurrentPairValue,
  setDataDepth,
  setPairType,
  setTradesData,
  setConvertData,
} = exchangeSlice.actions;
export default exchangeSlice.reducer;
