import { uniqueId } from '@/utils/id';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ToastType {
  id: string;
  createdAt: number;

  className?: string;
  text: string;
  time?: number;
}

export type ToastState = { [id: string]: ToastType };

const initialState: ToastState = {};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: {
      reducer: (state, action: PayloadAction<ToastType>) => {
        state[action.payload.id] = action.payload;
      },
      prepare: (toast: Partial<ToastType>) => {
        return {
          payload: {
            createdAt: new Date().getTime(),
            id: uniqueId(),
            ...toast,
          } as ToastType,
        };
      },
    },
    removeToast: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;

export default toastSlice;
