import { createSelector } from '@reduxjs/toolkit';
import {
  getDataFromEncouterRankingRankKey,
  getDataFromRosterCharacterKey,
} from 'utils/key';
import { RootState } from '../store';
import { selectWCLRegion } from '../wcl/selector';

export const selectPlanState = (state: RootState) => state.plan;

export const selectPlanEncounterForm = createSelector(
  [selectPlanState],
  (planState) => planState.encounterForm,
);

export const selectPlanFilterCustomReportByEncouterId = createSelector(
  [selectPlanState],
  (planState) => planState.filterCustomReportByEncouterId,
);

export const selectPlanCustomReportFightsSelectedByReportCode = (
  reportCode: string,
) =>
  createSelector([selectPlanState], (planState) =>
    planState.customReportFightsSelected.filter((f) =>
      f.startsWith(reportCode),
    ),
  );

export const selectPlanBestLogsFightsSelectedByCharacterAndPartition = (
  characterKey: string,
  partition: number,
) =>
  createSelector([selectPlanState], (planState) =>
    planState.bestLogsFightsSelected.filter((f) => {
      const { characterKey: fCharacterKey, partition: fPartition } =
        getDataFromEncouterRankingRankKey(f);

      return characterKey === fCharacterKey && partition === fPartition;
    }),
  );

export const selectPlanCustomReportFightsSelectedByEncounterFormCount =
  createSelector(
    [selectPlanState, selectWCLRegion],
    (planState, WCLRegion) =>
      planState.customReportFightsSelected.filter((f) => {
        const [_, region, encounterId, difficulty] = f.split('-');
        return (
          region === WCLRegion &&
          encounterId === planState.encounterForm.encounterId.toString() &&
          difficulty === planState.encounterForm.difficulty.toString()
        );
      }).length,
  );

export const selectPlanBestLogsFightsSelectedByEncounterFormCount =
  createSelector([selectPlanState, selectWCLRegion], (planState, WCLRegion) => {
    const fightsSelected = planState.bestLogsFightsSelected.filter((f) => {
      const { characterKey, encounterId, difficulty } =
        getDataFromEncouterRankingRankKey(f);
      const { serverRegion } = getDataFromRosterCharacterKey(characterKey);

      return (
        serverRegion === WCLRegion.toLowerCase() &&
        encounterId === planState.encounterForm.encounterId &&
        difficulty === planState.encounterForm.difficulty
      );
    });
    const uniqueFights: string[] = [];
    fightsSelected.forEach((f) => {
      const { reportCode, fightId } = getDataFromEncouterRankingRankKey(f);
      const key = `${reportCode}-${fightId}`;
      if (!uniqueFights.includes(key)) uniqueFights.push(key);
    });

    return { total: fightsSelected.length, unique: uniqueFights.length };
  });
