import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LanguageCode } from '../../../../public/static/charting_library/charting_library';
import { RootState } from 'store';
import { USER_COOKIES } from 'utils/constant';
import { getCookies } from '@cross/cookies';

export interface TSystemReducer {
  language: string;
  languageType: number;
  authModal: 'login' | 'signup' | 'auth' | '2fa' | null;
  marginModal: boolean;
  kycModal: boolean;
  mfaModal: boolean;
  showPairSelector: boolean;
  exchange: {
    quickOrder: boolean;
    market: boolean;
    chart: boolean;
    board: boolean;
    orderBook: boolean;
    trades: boolean;
    openOrders: boolean;
    walletSnap: boolean;
    language: LanguageCode;
    currency: string;
    currentPair: any;
    fullscreen: boolean;
  };
}

const initialState = {
  language: getCookies(USER_COOKIES.language),
  languageType: getCookies(USER_COOKIES.language) === 'en' ? 2 : 5,
  authModal: null,
  marginModal: false,
  kycModal: false,
  mfaModal: false,
  showPairSelector: false,
  exchange: {
    quickOrder: false,
    market: true,
    chart: true,
    board: true,
    orderBook: true,
    trades: true,
    openOrders: true,
    walletSnap: true,
    language: 'en',
    currency: 'USDT',
    currentPair: null,
  },
} as TSystemReducer;

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      return {
        ...state,
        language: action.payload,
      };
    },
    setLanguageType(state) {
      return {
        ...state,
        languageType: state.language === 'en-US' ? 2 : 5,
      };
    },
    setExchange(
      state,
      action: PayloadAction<{
        name: keyof TSystemReducer['exchange'];
        value: boolean;
      }>
    ) {
      return {
        ...state,
        exchange: {
          ...state.exchange,
          [action.payload.name]: action.payload.value,
        },
      };
    },
    setCurrentPair(state, action: PayloadAction<any>) {
      return {
        ...state,
        exchange: {
          ...state.exchange,
          currentPair: action.payload,
        },
      };
    },
    setFullscreen(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        exchange: {
          ...state.exchange,
          fullscreen: action.payload,
        },
      };
    },
    setAuthModal(state, action: PayloadAction<TSystemReducer['authModal']>) {
      return {
        ...state,
        authModal: action.payload,
      };
    },
    togglePairSelectorOpen(state) {
      return {
        ...state,
        showPairSelector: !state.showPairSelector,
      };
    },
    toggleMarginModal(state, action: PayloadAction<boolean | undefined>) {
      return {
        ...state,
        marginModal: action.payload ?? !state.marginModal,
      };
    },
    toggleKYCModal(state, action: PayloadAction<boolean | undefined>) {
      return {
        ...state,
        kycModal: action.payload ?? !state.kycModal,
      };
    },
    setPairSelector(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        showPairSelector: action.payload,
      };
    },
    toggleMFAModal(state, action: PayloadAction<boolean | undefined>) {
      return {
        ...state,
        mfaModal: action.payload ?? !state.mfaModal,
      };
    },
  },
});

export const getSystem = (state: RootState): TSystemReducer => state.system;

export const getCurrentPair = (state: RootState): any => state.system.exchange.currentPair;
export const getAuthModal = (state: RootState): TSystemReducer['authModal'] => state.system.authModal;
export const getMarginModal = (state: RootState): boolean => state.system.marginModal!;
export const getKYCModal = (state: RootState): boolean => state.system.kycModal;
export const getMFAModal = (state: RootState): boolean => state.system.mfaModal;
export const getExchangeShowPairSelector = (state: RootState): boolean => state.system.showPairSelector;

export const {
  setLanguage,
  setLanguageType,
  setExchange,
  setCurrentPair,
  setFullscreen,
  setAuthModal,
  togglePairSelectorOpen,
  setPairSelector,
  toggleMarginModal,
  toggleKYCModal,
  toggleMFAModal,
} = systemSlice.actions;
export default systemSlice.reducer;
