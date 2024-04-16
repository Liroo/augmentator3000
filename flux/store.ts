import { combineReducers, configureStore } from '@reduxjs/toolkit';
import rosterSlice from './roster/reducer';
import statusSlice from './status/reducer';
import toastSlice from './toast/reducer';
import wclSlice from './wcl/reducer';

export const makeStore = () => {
  const rootReducer = combineReducers({
    [statusSlice.name]: statusSlice.reducer,
    [wclSlice.name]: wclSlice.reducer,
    [toastSlice.name]: toastSlice.reducer,
    [rosterSlice.name]: rosterSlice.reducer,
  });

  return configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
