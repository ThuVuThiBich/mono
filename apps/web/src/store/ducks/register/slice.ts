import { getCookies, parseJson, setCookies } from '@cross/cookies';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';
export interface IRegisterStore {
  email: string;
  token: string;
  password: string;
  referralId: string;
  confirmPassword: string;
}
const initialState: IRegisterStore = {
  email: '',
  token: '',
  password: '',
  referralId: '',
  confirmPassword: '',
};
const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<any>) {
      return {
        ...state,
        token: action.payload,
      };
    },
    setEmail(state, action: PayloadAction<any>) {
      return {
        ...state,
        email: action.payload,
      };
    },
    setPassword(state, action: PayloadAction<any>) {
      return {
        ...state,
        password: action.payload,
      };
    },
    setReferralId(state, action: PayloadAction<any>) {
      return {
        ...state,
        referralId: action.payload,
      };
    },
    setRegister(state, action: PayloadAction<any>) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const getRegister = (state: RootState) => state.register;
export const getEmailRegister = (state: RootState) => state.register.email;
export const { setToken, setEmail, setPassword, setReferralId, setRegister } = registerSlice.actions;
export default registerSlice.reducer;
