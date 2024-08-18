import { createSelector } from '@reduxjs/toolkit';
import { selectPlanState } from 'flux/plan/selector';
import { selectRosterInUseListWithWCLCharacter } from 'flux/roster/selector';
import {
  WCLCharacterEncounterRanking,
  WCLReportFight,
} from 'services/wcl/types';
import { generateTimeRanges } from 'utils/analysis';
import {
  getDataFromEncouterRankingRankKey,
  getDataFromReportFightKey,
} from 'utils/report';
import {
  getDataFromRosterCharacterKey,
  rosterCharacterToKey,
} from 'utils/roster';
import {
  selectWCLCharacters,
  selectWCLRegion,
  selectWCLReportWithDamageTable,
  selectWCLReportWithFights,
} from '../wcl/selector';
import {
  AnalysisDamageDoneEntry,
  AnalysisDamageDoneEntryParent,
  AnalysisTableRowParent,
} from './types';

// Complex selector that returns a dictionary of report codes with their fights selected
export const selectAnalysisReportFights = createSelector(
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
          const tmpRank = encounterRanking.ranks.find(
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
export const selectAnalysisTable = createSelector(
  [
    selectAnalysisReportFights,
    selectWCLReportWithDamageTable,
    selectRosterInUseListWithWCLCharacter,
  ],
  (reportFights, WCLReportWithDamageTable, rosterInUse) => {
    // Get the longest fight duration to generate time ranges
    const longestFightDuration = Object.values(reportFights).reduce(
      (acc, report) =>
        report.fights.reduce((acc, fight) => {
          const duration = fight.endTime - fight.startTime;
          return duration > acc ? duration : acc;
        }, acc),
      0,
    );
    const timeRanges = generateTimeRanges(longestFightDuration, 0);

    // Create a dictionary of characters in use
    const charactersInUse: { [characterKey: string]: boolean } = {};
    rosterInUse.forEach(({ rosterCharacter: character }) => {
      charactersInUse[rosterCharacterToKey(character)] = true;
    });

    // Create a dictionary of damage data
    const damageData: AnalysisDamageDoneEntry[] = [
      ...timeRanges,
    ] as AnalysisDamageDoneEntry[];

    // For each report fight, we will compute the damage done by each character
    Object.values(reportFights).forEach((report) => {
      report.fights.forEach((fight) => {
        const key = `${report.code}-${fight.id}`;
        const reportDamageTable = WCLReportWithDamageTable[key];

        if (!reportDamageTable || !reportDamageTable.tables) return;

        const reportFight = (reportDamageTable.fights || []).find(
          (f) => f.id === fight.id,
        );
        if (!reportFight) return;

        reportDamageTable.tables.forEach((table, index) => {
          // Verify start time of the table is corresponding to the index
          const tableStartTime = table.startTime - fight.startTime;
          const damageDataIndex = damageData[index];

          if (!damageDataIndex || damageDataIndex.startTime !== tableStartTime)
            return;

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

    // Create parent row with subentries grouped by 5
    const parentRows: AnalysisDamageDoneEntryParent[] = [];
    let parentRow: AnalysisDamageDoneEntryParent | undefined = undefined;
    damageData.forEach((row, index) => {
      if (!parentRow) {
        parentRow = {
          entries: {},
          startTime: row.startTime,
          endTime: row.endTime,
          subEntries: [],
        };
        parentRows.push(parentRow);
      }

      parentRow.subEntries.push(row);

      // Merge entries
      Object.values(row.entries || {}).forEach((entry) => {
        if (!parentRow) return;
        if (!parentRow.entries[entry.characterKey])
          parentRow.entries[entry.characterKey] = {
            characterKey: entry.characterKey,
            average: 0,
            total: 0,
            count: 0,
          };
        parentRow.entries[entry.characterKey].total += entry.total;
        parentRow.entries[entry.characterKey].count += entry.count;
        parentRow.entries[entry.characterKey].average = Math.round(
          parentRow.entries[entry.characterKey].total /
            parentRow.entries[entry.characterKey].count,
        );
      });

      // If we reach 5 subentries or the end of the damage data, we close the parent row
      if (parentRow.subEntries.length >= 5 || index === damageData.length - 1) {
        parentRow.endTime = row.endTime;
        parentRow = undefined;
      }
    });

    // Convert parent rows to table rows
    const table: AnalysisTableRowParent[] = parentRows.map((parentRow) => {
      const tableRow: AnalysisTableRowParent = {
        startTime: parentRow.startTime,
        endTime: parentRow.endTime,
        entries: Object.values(parentRow.entries || {})
          .map((entry) => entry)
          .sort((a, b) => b.average - a.average),
        subEntries: parentRow.subEntries.map((subEntry) => ({
          startTime: subEntry.startTime,
          endTime: subEntry.endTime,
          entries: Object.values(subEntry.entries || {})
            .map((entry) => entry)
            .sort((a, b) => b.average - a.average),
        })),
      };

      return tableRow;
    });

    return table;
  },
);
