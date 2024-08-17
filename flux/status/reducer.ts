import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { FulfilledAction, PendingAction, RejectedAction } from 'flux/types';

export enum StatusEnum {
  Idle = 'idle',
  Pending = 'pending',
  Fulfilled = 'fulfilled',
  Rejected = 'rejected',
}

export interface StatusState {
  [actionType: string]: {
    [id: string]: {
      status: StatusEnum;
      error?: string | null;
    };
  };
}

const initialState: StatusState = {};

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setStatusIdle: {
      reducer: (
        state,
        action: PayloadAction<string, string, { id: string }>,
      ) => {
        if (!state[action.payload]) state[action.payload] = {};
        state[action.payload][action.meta.id] = {
          status: StatusEnum.Idle,
          error: null,
        };
      },
      prepare: (actionType: string, id: string = 'default') => ({
        payload: actionType,
        meta: { id },
      }),
    },
    setStatusPending: {
      reducer: (
        state,
        action: PayloadAction<string, string, { id: string }>,
      ) => {
        if (!state[action.payload]) state[action.payload] = {};
        state[action.payload][action.meta.id] = {
          status: StatusEnum.Pending,
          error: null,
        };
      },
      prepare: (actionType: string, id: string = 'default') => ({
        payload: actionType,
        meta: { id },
      }),
    },
    setStatusFulfilled: {
      reducer: (
        state,
        action: PayloadAction<string, string, { id: string }>,
      ) => {
        if (!state[action.payload]) state[action.payload] = {};
        state[action.payload][action.meta.id] = {
          status: StatusEnum.Fulfilled,
          error: null,
        };
      },
      prepare: (actionType: string, id: string = 'default') => ({
        payload: actionType,
        meta: { id },
      }),
    },
    setStatusRejected: {
      reducer: (
        state,
        action: PayloadAction<string, string, { id: string; error?: string }>,
      ) => {
        if (!state[action.payload]) state[action.payload] = {};
        state[action.payload][action.meta.id] = {
          status: StatusEnum.Rejected,
          error: action.meta.error,
        };
      },
      prepare: (
        actionType: string,
        id: string = 'default',
        error?: string,
      ) => ({
        payload: actionType,
        meta: { id, error },
      }),
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      (action: PendingAction) => action.type.endsWith('/pending'),
      (state, action: any) => {
        const actionType = action.type.replace('/pending', '');
        const key = action.meta.arg?.key || action.meta.arg?.id || 'default';

        if (!state[actionType]) state[actionType] = {};
        state[actionType][key] = { status: StatusEnum.Pending, error: null };
      },
    );
    builder.addMatcher(
      (action: FulfilledAction) => action.type.endsWith('/fulfilled'),
      (state, action: any) => {
        const actionType = action.type.replace('/fulfilled', '');
        const key = action.meta.arg?.key || action.meta.arg?.id || 'default';

        if (!state[actionType]) state[actionType] = {};
        state[actionType][key] = { status: StatusEnum.Fulfilled, error: null };
      },
    );
    builder.addMatcher(
      (action: RejectedAction) => action.type.endsWith('/rejected'),
      (state, action: any) => {
        const actionType = action.type.replace('/rejected', '');
        const key = action.meta.arg?.key || action.meta.arg?.id || 'default';

        if (!state[actionType]) state[actionType] = {};
        state[actionType][key] = {
          status: StatusEnum.Rejected,
          error: action.error.message,
        };
      },
    );
  },
});

export const {
  setStatusIdle,
  setStatusPending,
  setStatusFulfilled,
  setStatusRejected,
} = statusSlice.actions;

export default statusSlice;
