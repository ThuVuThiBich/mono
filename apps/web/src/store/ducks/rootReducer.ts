import { combineReducers } from '@reduxjs/toolkit';

import accountReducer from './account/slice';
import systemReducer from './system/slice';
import exchangeReducer from './exchange/slice';
import historyReducer from './history/slice';
import subAccountReducer from './sub_account/slice';
import walletReducer from './wallet/slice';
import StakeReducer from './stake/slice';
import RegisterReducer from './register/slice';

const createRootReducer = () => {
  return combineReducers({
    account: accountReducer,
    system: systemReducer,
    exchange: exchangeReducer,
    history: historyReducer,
    subAccount: subAccountReducer,
    wallet: walletReducer,
    stake: StakeReducer,
    register: RegisterReducer,
  });
};

export default createRootReducer;
