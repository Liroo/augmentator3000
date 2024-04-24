import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectWCLState = (state: RootState) => state.wcl;

export const selectWCLCharacter = (name: string, serverSlug: string) =>
  createSelector([selectWCLState], (wclState) =>
    Object.values(wclState.characters).find(
      (c) => c.name === name && c.serverSlug === serverSlug,
    ),
  );

export const selectWCLCharacterByCanonicalID = (canonicalID: string) =>
  createSelector([selectWCLState], (wclState) =>
    Object.values(wclState.characters).find(
      (c) => c.canonicalID === canonicalID,
    ),
  );

export const selectWCLCharacters = createSelector(
  [selectWCLState],
  (wclState) => wclState.characters,
);

export const selectWCLReportsByEncounterID = (encounterID: number) =>
  createSelector([selectWCLState], (wclState) =>
    Object.values(wclState.reports).filter(
      (r) => r.associatedEncounterID === encounterID,
    ),
  );

export const selectWCLReportWithFights = createSelector(
  [selectWCLState],
  (wclState) => Object.values(wclState.reportWithFights),
);
