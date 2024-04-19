import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectWCLState = (state: RootState) => state.wcl;

export const selectWCLCharacters = createSelector(
  [selectWCLState],
  (wclState) => wclState.characters,
);

export const selectWCLReports = createSelector(
  [selectWCLState],
  (wclState) => wclState.reports,
);
