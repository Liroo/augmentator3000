import { rosterCharacterToKey } from '@/utils/roster';
import { characterToInternalId } from '@/utils/wcl';
import { createSelector } from '@reduxjs/toolkit';
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

export const selectWCLCharacterByInternalId = (internalId: string) =>
  createSelector([selectWCLState], (wclState) =>
    Object.values(wclState.characters).find(
      (c) => characterToInternalId(c) === internalId,
    ),
  );

export const selectWCLCharacterByInternalIdCharacterKey = (
  characterKey: string,
) =>
  createSelector([selectWCLState], (wclState) =>
    Object.values(wclState.characters).find(
      (c) => rosterCharacterToKey(c) === characterKey,
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

export const selectWCLReportsWithFightsByEncoounterID = (encounterID: number) =>
  createSelector([selectWCLReportWithFights], (reportWithFights) => {
    const reports = reportWithFights.filter((r) =>
      r.fights?.find((f) => f.encounterID === encounterID),
    );
    return reports.map((r) => ({
      ...r,
      fights: r.fights?.filter((f) => f.encounterID === encounterID),
    }));
  });
