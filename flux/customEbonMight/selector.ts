import { createSelector } from '@reduxjs/toolkit';
import {
  AnalysisDamageDoneEntry,
  AnalysisTableRowParent,
} from 'flux/analysis/types';
import { selectPlanEncounterForm, selectPlanState } from 'flux/plan/selector';
import { selectRosterInUseListWithWCLCharacter } from 'flux/roster/selector';
import { RootState } from 'flux/store';
import {
  WCLCharacterEncounterRanking,
  WCLReportFight,
} from 'services/wcl/types';
import { applyPrioritiesToEntries } from 'utils/analysis';
import {
  analysisSetupToKey,
  encounterToKey,
  getDataFromEncouterRankingRankKey,
  getDataFromReportFightKey,
  getDataFromRosterCharacterKey,
  rosterCharacterToKey,
} from 'utils/key';
import {
  selectWCLCharacters,
  selectWCLRegion,
  selectWCLReportWithDamageTable,
  selectWCLReportWithFights,
} from '../wcl/selector';

export const selectCustomEbonMightState = (state: RootState) =>
  state.customEbongMight;

export const selectCustomEbonMightTimeRanges = createSelector(
  [selectCustomEbonMightState, selectPlanEncounterForm],
  (customEbonMightState, encounterForm) => {
    const key = encounterToKey(
      encounterForm.encounterId,
      encounterForm.difficulty,
    );

    return customEbonMightState.timeRanges[key] || [];
  },
);

export const selectCustomEbonMightExcludedBulk = createSelector(
  [selectCustomEbonMightState],
  (customEbonMightState) => customEbonMightState.excludedBulk,
);

export const selectCustomEbonMightExcludedByKey = (key: string) =>
  createSelector(
    [selectCustomEbonMightState, selectRosterInUseListWithWCLCharacter],
    (customEbonMightState, roster) =>
      (customEbonMightState.excluded[key] || []).filter((characterKey) => {
        return roster.find(
          ({ rosterCharacter }) =>
            rosterCharacterToKey(rosterCharacter) === characterKey,
        );
      }),
  );

export const selectCustomEbonMightPriorityByKey = (key: string) =>
  createSelector(
    [selectCustomEbonMightState, selectRosterInUseListWithWCLCharacter],
    (customEbonMightState, roster) =>
      (customEbonMightState.priority[key] || new Array(6).fill('')).map(
        (characterKey) => {
          if (!characterKey) return '';

          const characterExists = roster.find(
            ({ rosterCharacter }) =>
              rosterCharacterToKey(rosterCharacter) === characterKey,
          );

          if (characterExists) return characterKey;
          return '';
        },
      ),
  );

// Complex selector that returns a dictionary of report codes with their fights selected
export const selectCustomEbonMightReportFights = createSelector(
  [
    selectPlanState,
    selectWCLRegion,
    selectWCLReportWithFights,
    selectWCLCharacters,
  ],
  (planState, WCLregion, reportsWithFights, WCLCharacters) => {
    const { encounterId, difficulty } = planState.encounterForm;

    const reportFights: {
      [reportCode: string]: {
        code: string;
        fights: {
          id: number;
          fromCustom: boolean;
          characterKeys?: string[];
          startTime: number;
          endTime: number;
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

      const report = reportsWithFights.find((r) => r.code === reportCode);
      if (!report) return;
      const fight = (report.fights as WCLReportFight[]).find(
        (f) => f.id === fightId,
      );

      if (!reportFights[reportCode])
        reportFights[reportCode] = { code: reportCode, fights: [] };
      reportFights[reportCode].fights.push({
        id: fightId,
        fromCustom: true,
        startTime: fight?.startTime || 0,
        endTime: fight?.endTime || 0,
      });
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

      const reportFight = reportFights[reportCode].fights.find(
        (f) => f.id === fightId,
      );

      // Already included in the custom report (so everyone will be analysed)
      if (reportFight?.fromCustom) return;
      else if (reportFight) {
        if (!reportFight.characterKeys) reportFight.characterKeys = [];
        if (!reportFight.characterKeys.includes(characterKey))
          reportFight.characterKeys.push(characterKey);
      } else {
        const character = WCLCharacters.find(
          (c) => rosterCharacterToKey(c) === characterKey,
        );
        if (!character || !character.encounterRankings) return;

        let rank: WCLCharacterEncounterRanking['ranks'][0] | undefined;
        const encounterRankings = Object.values(character.encounterRankings);
        for (const encounterRanking of encounterRankings) {
          const tmpRank = (encounterRanking.ranks || []).find(
            (r) => r.report.code === reportCode && r.report.fightID === fightId,
          );

          if (tmpRank) {
            rank = tmpRank;
            break;
          }
        }

        if (!rank) return;

        reportFights[reportCode].fights.push({
          id: fightId,
          fromCustom: false,
          characterKeys: [characterKey],
          startTime: rank.startTime - rank.report.startTime,
          endTime: rank.startTime - rank.report.startTime + rank.duration,
        });
      }
    });

    return reportFights;
  },
);

// Generate table of damage done for selectedFight with current roster
// Does not take into account any other setup as excluded or priority characters
export const selectCustomEbonMightTable = createSelector(
  [
    selectCustomEbonMightReportFights,
    selectWCLReportWithDamageTable,
    selectRosterInUseListWithWCLCharacter,
    selectCustomEbonMightTimeRanges,
  ],
  (reportFights, WCLReportWithDamageTable, rosterInUse, timeRanges) => {
    // Create a dictionary of characters in use
    const charactersInUse: { [characterKey: string]: boolean } = {};
    rosterInUse.forEach(({ rosterCharacter: character }) => {
      charactersInUse[rosterCharacterToKey(character)] = true;
    });

    // Create a dictionary of damage data
    const damageData: AnalysisDamageDoneEntry[] = timeRanges.map((tr) => ({
      startTime: tr.startTime,
      endTime: tr.endTime,
      entries: {},
    })) as AnalysisDamageDoneEntry[];

    // For each report fight, we will compute the damage done by each character
    Object.values(reportFights).forEach((report) => {
      report.fights.forEach((fight) => {
        const key = `${report.code}_${fight.id}`;
        const reportDamageTable = WCLReportWithDamageTable[key];

        if (!reportDamageTable || !reportDamageTable.tables) return;

        const reportFight = (reportDamageTable.fights || []).find(
          (f) => f.id === fight.id,
        );
        if (!reportFight) return;

        reportDamageTable.tables.forEach((table, index) => {
          // Verify start time of the table is corresponding to the index
          const tableStartTime = table.startTime - fight.startTime;
          const tableEndTime = table.endTime - fight.startTime;

          // find correct damageData index
          const damageDataIndex = damageData.find(
            (dd) =>
              dd.startTime <= tableStartTime && dd.endTime >= tableEndTime,
          );

          if (!damageDataIndex) return;

          table.entries.forEach((tableEntry) => {
            // Remove entries with no total damage, it can be caused by an intermission or a death
            // but computing death damage will be bad in progress
            if (tableEntry.total === 0) return;
            // Verify that for a single entry, the character is in use
            const characterKey = rosterCharacterToKey(tableEntry);
            if (!charactersInUse[characterKey]) return;
            // Verify that we want to compute the entry for this character in case the fight is coming from best logs
            if (
              !fight.fromCustom &&
              !fight.characterKeys?.includes(characterKey)
            )
              return;

            if (!damageDataIndex.entries) damageDataIndex.entries = {};
            if (!damageDataIndex.entries[characterKey])
              damageDataIndex.entries[characterKey] = {
                characterKey,
                average: 0,
                total: 0,
                count: 0,
              };
            damageDataIndex.entries[characterKey].total += tableEntry.total;
            damageDataIndex.entries[characterKey].count += 1;
            damageDataIndex.entries[characterKey].average = Math.round(
              damageDataIndex.entries[characterKey].total /
                damageDataIndex.entries[characterKey].count,
            );
          });
        });
      });
    });

    // Convert parent rows to table rows
    const table: AnalysisTableRowParent[] = damageData.map((parentRow) => {
      const tableRow: AnalysisTableRowParent = {
        startTime: parentRow.startTime,
        endTime: parentRow.endTime,
        entries: Object.values(parentRow.entries || {})
          .map((entry) => entry)
          .sort((a, b) => b.total - a.total),
        subEntries: [],
      };

      return tableRow;
    });

    return table;
  },
);

export const selectCustomEbonMightTableWithExcluded = createSelector(
  [
    selectCustomEbonMightState,
    selectCustomEbonMightTable,
    selectPlanEncounterForm,
    selectWCLRegion,
  ],
  (customEbonMightState, analysisTable, encounterForm, WCLRegion) => {
    const table = analysisTable.map((parentRow, index) => {
      const excludedKey = analysisSetupToKey(
        WCLRegion,
        encounterForm.encounterId,
        encounterForm.difficulty,
        index,
      );
      const excluded = customEbonMightState.excluded[excludedKey] || [];
      const tableRow: AnalysisTableRowParent = {
        startTime: parentRow.startTime,
        endTime: parentRow.endTime,
        entries: parentRow.entries.filter(
          (entry) => !excluded.includes(entry.characterKey),
        ),
        subEntries: [],
      };

      return tableRow;
    });

    return table;
  },
);

// To be honest, I don't even know what I'm doing anymore
export const selectCustomEbonMightTableWithExcludedAndPriority = createSelector(
  [
    selectCustomEbonMightState,
    selectCustomEbonMightTableWithExcluded,
    selectPlanEncounterForm,
    selectWCLRegion,
    selectRosterInUseListWithWCLCharacter,
  ],
  (
    customEbonMightState,
    analysisTableWithExcluded,
    encounterForm,
    WCLRegion,
    roserInUse,
  ) => {
    const table = analysisTableWithExcluded.map((parentRow, index) => {
      const key = analysisSetupToKey(
        WCLRegion,
        encounterForm.encounterId,
        encounterForm.difficulty,
        index,
      );

      // Get priority for that index and make sure they exists
      const priority = (
        customEbonMightState.priority[key] || new Array(6).fill('')
      ).map((characterKey) => {
        if (!characterKey) return null;

        const character = roserInUse.find(
          ({ rosterCharacter }) =>
            rosterCharacterToKey(rosterCharacter) === characterKey,
        );

        if (character) return characterKey;
        return null;
      });

      const tableRow: AnalysisTableRowParent = {
        startTime: parentRow.startTime,
        endTime: parentRow.endTime,
        entries: applyPrioritiesToEntries(priority, parentRow.entries),
        subEntries: [],
      };

      return tableRow;
    });

    return table;
  },
);
