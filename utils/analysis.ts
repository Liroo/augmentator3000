import { AnalysisTableEntry } from 'flux/analysis/types';

// Ebon might duration in ms
export const ebonMightDuration = 30000;
export const ebonMightSplit = 5;
// We'll use multiple sub durations for the analysis
export const ebonMightSubDuration = ebonMightDuration / ebonMightSplit;

// First EM is 4s after the start
export const delayStartTime = 4000;

export const reportDamageTableFilterExpression =
  'ability.id NOT IN (409632, 402583, 408682, 408694, 401324, 401306, 401422, 401428, 418774, 418588, 419591, 418607, 406251, 406889, 379403, 408791, 378426, 381006, 381700, 406764, 394453, 370794, 408836, 408815, 381475, 281721, 214397, 408469, 374087, 370817, 426564, 417458, 424965, 425181, 419737, 265953, 425154, 425156, 422146, 426341, 426431, 426486, 426339, 426527, 426535, 426306, 259756, 426288, 427209, 422956, 427161, 424324, 419279, 215444, 214168, 214169, 228784, 214350, 422750, 425701, 422750, 425461, 417458, 215407, 270827, 213785, 425509, 414532, 417134, 413584, 424094, 386301, 243991, 426297, 425610)';

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
    if (fromIndex === -1) return;

    const element = newEntries[fromIndex];
    newEntries.splice(fromIndex, 1);
    newEntries.splice(index, 0, element);

    return;
  });

  return newEntries;
};
