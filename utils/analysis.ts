import { AnalysisTableEntry } from 'flux/analysis/types';
import { ABILITY_BLACKLIST, ABILITY_NO_BOE_SCALING } from './filter';

// Ebon might duration in ms
export const ebonMightDuration = 30000;
export const ebonMightSplit = 5;
// We'll use multiple sub durations for the analysis
export const ebonMightSubDuration = ebonMightDuration / ebonMightSplit;

// First EM is 4s after the start
export const delayStartTime = 4000;

// https://github.com/WoWAnalyzer/WoWAnalyzer/blob/the-war-within/src/analysis/retail/evoker/augmentation/modules/util/abilityFilter.ts
export const reportDamageTableFilterExpression = `ability.id NOT IN (${[...ABILITY_BLACKLIST, ...ABILITY_NO_BOE_SCALING].join(', ')})`;

export type TimeRange = {
  startTime: number;
  endTime: number;
};

export const generateTimeRanges = (
  max: number,
  startTime: number = 0,
): TimeRange[] => {
  const timeRanges = [];
  for (let i = 0; i < max; i += ebonMightSubDuration) {
    timeRanges.push({
      startTime: (i === 0 ? i + delayStartTime : i) + startTime,
      endTime: i + ebonMightSubDuration - 1 + startTime,
    });
  }
  return timeRanges;
};

export const applyPrioritiesToEntries = (
  priority: (string | null)[],
  entries: AnalysisTableEntry[],
) => {
  const newEntries = entries.map((entry) => {
    entry.priority = priority.includes(entry.characterKey);
    return entry;
  });

  priority.forEach((key, index) => {
    if (!key) return;

    // find index of key in entries
    const fromIndex = newEntries.findIndex(
      (entry) => entry.characterKey === key,
    );

    if (fromIndex >= 0) {
      const element = newEntries[fromIndex];
      newEntries.splice(fromIndex, 1);
      newEntries.splice(index, 0, element);
    } else {
      newEntries.splice(index, 0, {
        characterKey: key,
        total: 0,
        average: 0,
        count: 0,
        priority: true,
      });
    }

    return;
  });

  return newEntries;
};
