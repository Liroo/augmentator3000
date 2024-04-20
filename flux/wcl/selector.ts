import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectWCLState = (state: RootState) => state.wcl;

export const selectWCLCharacter = (name: string, serverSlug: string) =>
  createSelector([selectWCLState], (wclState) =>
    Object.values(wclState.characters).find(
      (c) => c.name === name && c.serverSlug === serverSlug,
    ),
  );

export const selectWCLCharacters = createSelector(
  [selectWCLState],
  (wclState) => wclState.characters,
);

export const selectWCLReports = createSelector(
  [selectWCLState],
  (wclState) => wclState.reports,
);
