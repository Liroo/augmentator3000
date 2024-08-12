import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  credentials: {
    clientId: string;
    clientSecret: string;
  };
  bearerToken: string | null;
}

const initialState: AuthState = {
  credentials: {
    clientId: '',
    clientSecret: '',
  },
  bearerToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<AuthState['credentials']>,
    ) => {
      state.credentials = action.payload;
    },
    setBearerToken: (state, action: PayloadAction<string | null>) => {
      state.bearerToken = action.payload;
    },
  },
});

export const { setCredentials, setBearerToken } = authSlice.actions;

export default authSlice;
