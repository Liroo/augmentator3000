import { AsyncThunk } from '@reduxjs/toolkit';

import { AppDispatch, RootState } from 'flux/store';

export type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

export type PendingAction = ReturnType<GenericAsyncThunk['pending']>;
export type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>;
export type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>;

export interface ThunkArg {
  key?: string;
  id?: string;
}

export interface ThunkApiConfig {
  state: RootState;
  dispatch: AppDispatch;
}
