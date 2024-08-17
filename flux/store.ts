import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import authSlice from './auth/reducer';
import listenerMiddleware from './listener';
import planSlice from './plan/reducer';
import reportSlice from './report/reducer';
import rosterSlice from './roster/reducer';
import statusSlice from './status/reducer';
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

export const makeStore = () => {
  const rootPersistConfig = {
    storage,
    key: 'augmentator3000-root',
    stateReconciler: autoMergeLevel2 as any,
    blacklist: ['auth', 'status'],
  };

  const authPersistConfig = {
    key: 'auth',
    storage,
    blacklist: ['bearerToken'],
  };

  const rootReducer = combineReducers({
    [authSlice.name]: persistReducer(authPersistConfig, authSlice.reducer),
    [statusSlice.name]: statusSlice.reducer,
    [wclSlice.name]: wclSlice.reducer,
    [rosterSlice.name]: rosterSlice.reducer,
    [planSlice.name]: planSlice.reducer,
    [reportSlice.name]: reportSlice.reducer,
  });

  const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).prepend(listenerMiddleware.middleware),
  });
  const persistor = persistStore(store);

  return { store, persistor };
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['store']['getState']>;
export type AppDispatch = AppStore['store']['dispatch'];
