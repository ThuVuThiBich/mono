import { USER_COOKIES } from '../../../utils/constant';
import { TListSubAccount } from 'api/sub_account/index';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { getCookies, removeCookies, setCookies } from '@cross/cookies';
import { SubAccountItem } from 'api/sub_account/types';

export interface TSubAccountReducer {
  visibleModalCreate: boolean;
  visibleModalTransfer?: SubAccountItem & { coin?: string };
  visibleModalDelete?: SubAccountItem;
  visibleModalEdit?: SubAccountItem;
  currentSubAccount: string;
  mainAccountId: string;
  listSubAccount: TListSubAccount[];
  isLoadingSub: string;
}

export const MAIN_ACCOUNT_KEY = 'Main Account';

const initialState = {
  visibleModalCreate: false,
  visibleModalTransfer: undefined,
  visibleModalDelete: undefined,
  visibleModalEdit: undefined,
  currentSubAccount: getCookies(USER_COOKIES.subAccount) ? getCookies(USER_COOKIES.subAccount) : 'Main Account',
  mainAccountId: '',
  listSubAccount: [],
  isLoadingSub: '',
} as TSubAccountReducer;

const subAccountSlice = createSlice({
  name: 'subAccount',
  initialState,
  reducers: {
    setModalCreate(state, action: PayloadAction<any>) {
      return {
        ...state,
        visibleModalCreate: action.payload,
      };
    },
    setModalTransfer(state, action: PayloadAction<any>) {
      return {
        ...state,
        visibleModalTransfer: action.payload,
      };
    },
    setModalEdit(state, action: PayloadAction<SubAccountItem | undefined>) {
      return {
        ...state,
        visibleModalEdit: action.payload,
      };
    },
    setModalDelete(state, action: PayloadAction<SubAccountItem | undefined>) {
      return {
        ...state,
        visibleModalDelete: action.payload,
      };
    },
    setCurrentSubAccount(state, action: PayloadAction<any>) {
      if (action.payload === MAIN_ACCOUNT_KEY) {
        removeCookies(USER_COOKIES.subAccount);
      } else setCookies(USER_COOKIES.subAccount, action.payload.toString());
      return {
        ...state,
        currentSubAccount: action.payload,
      };
    },
    setListSubAccount(state, action: PayloadAction<any>) {
      return {
        ...state,
        listSubAccount: action.payload,
      };
    },
    setMainAccountId(state, action: PayloadAction<any>) {
      return {
        ...state,
        mainAccountId: action.payload,
      };
    },
    setIsLoadingSub(state, action: PayloadAction<any>) {
      return {
        ...state,
        isLoadingSub: action.payload,
      };
    },
  },
});

export const getSubAccount = (state: RootState): TSubAccountReducer => state.subAccount;
export const getCurrentSubAccount = (state: RootState): string => state.subAccount.currentSubAccount;

export const {
  setModalCreate,
  setModalTransfer,
  setCurrentSubAccount,
  setModalDelete,
  setModalEdit,
  setListSubAccount,
  setMainAccountId,
  setIsLoadingSub,
} = subAccountSlice.actions;

export default subAccountSlice.reducer;
