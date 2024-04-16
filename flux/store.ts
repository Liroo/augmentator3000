import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import rosterSlice from './roster/reducer';
import statusSlice from './status/reducer';
import toastSlice from './toast/reducer';
import wclSlice from './wcl/reducer';

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: number) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage: storage,
};

export const makeStore = () => {
  const rootReducer = combineReducers({
    [statusSlice.name]: statusSlice.reducer,
    [wclSlice.name]: wclSlice.reducer,
    [toastSlice.name]: toastSlice.reducer,
    [rosterSlice.name]: rosterSlice.reducer,
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
  });
  const persistor = persistStore(store);

  return { store, persistor };
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['store']['getState']>;
export type AppDispatch = AppStore['store']['dispatch'];
