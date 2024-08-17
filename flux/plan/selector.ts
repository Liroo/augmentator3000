import { createSelector } from '@reduxjs/toolkit';
import {
  getDataFromEncouterRankingRankKey,
  getDataFromReportFightKey,
} from 'utils/report';
import { getDataFromRosterCharacterKey } from 'utils/roster';
import { RootState } from '../store';
import { selectWCLRegion } from '../wcl/selector';

const selectPlanState = (state: RootState) => state.plan;

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

export const selectPlanReportFightsSelected = createSelector(
  [selectPlanState, selectWCLRegion],
  (planState, WCLregion) => {
    const { encounterId, difficulty } = planState.encounterForm;

    const reportFights: {
      [reportCode: string]: {
        code: string;
        fights: {
          id: number;
          fromCustom: boolean;
          characterKeys?: string[];
        }[];
      };
    } = {};

    planState.customReportFightsSelected.forEach((customFightKey) => {
      const {
        reportCode,
        region,
        encounterId: fightEncounterId,
        difficulty: fightDifficulty,
        fightId,
      } = getDataFromReportFightKey(customFightKey);

      if (WCLregion !== region) return;
      if (encounterId !== fightEncounterId) return;
      if (difficulty !== fightDifficulty) return;

      if (!reportFights[reportCode])
        reportFights[reportCode] = { code: reportCode, fights: [] };
      reportFights[reportCode].fights.push({ id: fightId, fromCustom: true });
    });

    planState.bestLogsFightsSelected.forEach((bestLogsFightKey) => {
      const {
        characterKey,
        encounterId: fightEncounterId,
        difficulty: fightDifficulty,
        reportCode,
        fightId,
      } = getDataFromEncouterRankingRankKey(bestLogsFightKey);
      const { serverRegion: region } =
        getDataFromRosterCharacterKey(characterKey);

      if (WCLregion.toLowerCase() !== region) return;
      if (encounterId !== fightEncounterId) return;
      if (difficulty !== fightDifficulty) return;

      if (!reportFights[reportCode])
        reportFights[reportCode] = { code: reportCode, fights: [] };

      const fight = reportFights[reportCode].fights.find(
        (f) => f.id === fightId,
      );
      // Already included in the custom report (so everyone will be analysed)
      if (fight?.fromCustom) return;
      else if (fight) {
        if (!fight.characterKeys) fight.characterKeys = [];
        if (!fight.characterKeys.includes(characterKey))
          fight.characterKeys.push(characterKey);
      } else {
        reportFights[reportCode].fights.push({
          id: fightId,
          fromCustom: false,
          characterKeys: [characterKey],
        });
      }
    });

    return reportFights;
  },
);
