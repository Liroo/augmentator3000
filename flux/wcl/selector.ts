import { createSelector } from '@reduxjs/toolkit';
import { rosterCharacterToKey } from 'utils/key';
import { RootState } from '../store';

const selectWCLState = (state: RootState) => state.wcl;

export const selectWCLRegion = createSelector(
  [selectWCLState],
  (wclState) => wclState.region,
);

export const selectWCLReportWithFights = createSelector(
  [selectWCLState, selectWCLRegion],
  (wclState, region) =>
    Object.values(wclState.reportWithFights).filter((r) => r.region === region),
);

export const selectWCLCharacters = createSelector(
  [selectWCLState, selectWCLRegion],
  (wclState, region) =>
    Object.values(wclState.characters).filter((c) => c.serverRegion === region),
);

export const selectWCLCharacterByCharacterKey = (characterKey: string) =>
  createSelector([selectWCLState], (wclState) =>
    Object.values(wclState.characters).find(
      (c) => rosterCharacterToKey(c) === characterKey,
    ),
  );

export const selectWCLReportWithDamageTable = createSelector(
  [selectWCLState],
  (wclState) => wclState.reportWithDamageTable,
);
