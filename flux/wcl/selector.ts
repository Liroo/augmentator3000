import { characterToInternalId } from '@/utils/wcl';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectWCLState = (state: RootState) => state.wcl;

export const selectWCLCharacter = (name: string, serverSlug: string) =>
  createSelector([selectWCLState], (wclState) =>
    Object.values(wclState.characters).find(
      (c) => c.name === name && c.serverSlug === serverSlug,
    ),
  );

export const selectWCLCharacterByInternalId = (internalId: string) =>
  createSelector([selectWCLState], (wclState) =>
    Object.values(wclState.characters).find(
      (c) => characterToInternalId(c) === internalId,
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
