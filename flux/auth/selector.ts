import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectAuthState = (state: RootState) => state.auth;

export const selectAuthCredentials = createSelector(
  [selectAuthState],
  (authState) => authState.credentials,
);

export const selectAuthBearerToken = createSelector(
  [selectAuthState],
  (authState) => authState.bearerToken,
);
