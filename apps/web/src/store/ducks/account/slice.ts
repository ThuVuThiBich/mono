import { getCookies, parseJson, setCookies } from '@cross/cookies';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { ICurrentCurrency, IUserAuth } from 'types/local';
import { initialCurrentCurrency, USER_COOKIES } from 'utils/constant';

export interface IAccountStore {
  currentCurrency: ICurrentCurrency;
  userAuth: IUserAuth;
}

const cookieCurrency = getCookies(USER_COOKIES.currentCurrency);

const currencyObj = parseJson(cookieCurrency);

const validCurrency = currencyObj?.coinType && currencyObj?.symbol && currencyObj?.rate;

const currentCurrency =
  !cookieCurrency || !validCurrency
    ? setCookies(USER_COOKIES.currentCurrency, JSON.stringify(initialCurrentCurrency))
    : currencyObj;

const initialState = {
  currentCurrency: currentCurrency || initialCurrentCurrency,
} as IAccountStore;

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setCurrentCurrency(state, action: PayloadAction<any>) {
      setCookies(USER_COOKIES.currentCurrency, JSON.stringify(action.payload));
      return {
        ...state,
        currentCurrency: action.payload,
      };
    },
    setUserAuth(state, action: PayloadAction<any>) {
      setCookies(USER_COOKIES.currentCurrency, JSON.stringify(action.payload));
      return {
        ...state,
        userAuth: action.payload,
      };
    },
  },
});

export const getAccount = (state: RootState) => state.account;
export const getCurrentCurrency = (state: RootState) => state.account.currentCurrency;
export const getUserAuth = (state: RootState) => state.account.userAuth;
export const getUserEmail = (state: RootState) => state.account.userAuth?.user?.account;
export const { setCurrentCurrency, setUserAuth } = accountSlice.actions;
export default accountSlice.reducer;
