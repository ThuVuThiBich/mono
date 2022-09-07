import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStakingInfo } from 'api/staking';
import { RootState } from 'store';

export type ISelectedStakeInfo = IStakingInfo & { coin: string };
export type IUnstakeModal = {
  coin: string;
  type: 3 | 2001 | 2002 | 2003 | 2999;
  orderId: string;
  max: string;
  min: string;
};
export type IRedeemModal = {
  number: number;
  coinName: string;
  orderId: string;
  type: 3 | 2001 | 2002 | 2003 | 2999;
};
export interface IStakeStore {
  openEarnModal: boolean;
  openStakeModal: boolean;
  openRedeemModal?: IRedeemModal;
  openUnstakeModal?: IUnstakeModal;
  selectedStakeInfo?: ISelectedStakeInfo;
}

const initialState = {
  openEarnModal: false,
  openStakeModal: false,
  openRedeemModal: undefined,
  openUnstakeModal: undefined,
  selectedStakeInfo: undefined,
} as IStakeStore;

const stakeSlice = createSlice({
  name: 'stake',
  initialState,
  reducers: {
    setStakeModal(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        openStakeModal: action.payload,
      };
    },
    setEarnModal(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        openEarnModal: action.payload,
      };
    },
    setUnstakeModal(state, action: PayloadAction<IUnstakeModal | undefined>) {
      return {
        ...state,
        openUnstakeModal: action.payload,
      };
    },
    setRedeemModal(state, action: PayloadAction<IRedeemModal | undefined>) {
      return {
        ...state,
        openRedeemModal: action.payload,
      };
    },
    setSelectedStakeInfo(state, action: PayloadAction<ISelectedStakeInfo>) {
      return {
        ...state,
        selectedStakeInfo: action.payload,
      };
    },
  },
});

export const getStakeModal = (state: RootState): boolean => state.stake.openStakeModal;
export const getEarnModal = (state: RootState): boolean => state.stake.openEarnModal;
export const getSelectedStakeInfo = (state: RootState) => state.stake.selectedStakeInfo;
export const getUnstakeModal = (state: RootState) => state.stake.openUnstakeModal;
export const getRedeemModal = (state: RootState) => state.stake.openRedeemModal;

export const { setStakeModal, setEarnModal, setUnstakeModal, setSelectedStakeInfo, setRedeemModal } =
  stakeSlice.actions;
export default stakeSlice.reducer;
