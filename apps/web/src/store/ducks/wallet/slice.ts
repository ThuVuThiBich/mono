import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';
import { ObjectTypes } from 'types/util-types';

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

const initialState = {
  free: {},
  freezed: {},
} as TWallet;

const systemSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet(state, action: PayloadAction<TWallet>) {
      return {
        free: {
          ...state.free,
          ...action.payload.free,
        },
        freezed: {
          ...state.freezed,
          ...action.payload.freezed,
        },
        borrow: {
          ...state.borrow,
          ...action.payload.borrow,
        },
      };
    },
  },
});

export const getWalletFree = (state: RootState) => state.wallet.free;
export const getWalletBorrow = (state: RootState) => state.wallet.borrow;
export const getWalletfreezed = (state: RootState) => state.wallet.freezed;

export const getWallet = (state: RootState) => state.wallet;

export const { setWallet } = systemSlice.actions;
export default systemSlice.reducer;
