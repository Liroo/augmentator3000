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
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import planSlice from './plan/reducer';
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
  const rootReducer = combineReducers({
    [statusSlice.name]: statusSlice.reducer,
    [wclSlice.name]: wclSlice.reducer,
    [rosterSlice.name]: rosterSlice.reducer,
    [planSlice.name]: planSlice.reducer,
  });

  const persistedReducer = persistReducer(
    { storage, key: 'root' },
    rootReducer,
  );

  const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
  const persistor = persistStore(store);

  return { store, persistor };
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['store']['getState']>;
export type AppDispatch = AppStore['store']['dispatch'];
