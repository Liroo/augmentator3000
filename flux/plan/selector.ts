import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectPlanState = (state: RootState) => state.plan;

export const selectPlanEncounterForm = createSelector(
  [selectPlanState],
  (planState) => planState.encounterForm,
);

export const selectPlanTimeRangesByKey = (key: string = 'default') =>
  createSelector(
    [selectPlanState],
    (planState) => planState.timeRanges[key] || [],
  );

export const selectPlanTimeRangesKeys = createSelector(
  [selectPlanState],
  (planState) => Object.keys(planState.timeRanges),
);

export const selectPlanSelectedFightsFromReportWithFightsByReportCode = (
  code: string,
) =>
  createSelector(
    [selectPlanState],
    (planState) => planState.selectedFightsFromReportWithFights[code] || [],
  );

export const selectPlanSelectedFightsFromReportWithFights = createSelector(
  [selectPlanState],
  (planState) => planState.selectedFightsFromReportWithFights,
);
