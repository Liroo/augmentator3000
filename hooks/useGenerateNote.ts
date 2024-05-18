import { useAppSelector } from '@/flux/hooks';
import { PlanStateTimeRange } from '@/flux/plan/reducer';
import {
  selectPlanEncounterForm,
  selectPlanTimeRangesByKey,
} from '@/flux/plan/selector';
import { selectRosterListEnhanced } from '@/flux/roster/selector';
import { selectWCLReportsByEncounterID } from '@/flux/wcl/selector';
import { ResultEntry } from '@/types/result';
import { characterToInternalId } from '@/utils/wcl';
import { WCLReportTableEntry } from '@/wcl/wcl';
import { useMemo } from 'react';

export const useGenerateNote = () => {
  const { encounterID, timeRangesKey } = useAppSelector(
    selectPlanEncounterForm,
  );
  const rosterListEnhanced = useAppSelector(selectRosterListEnhanced(true));
  const timeRanges = useAppSelector(selectPlanTimeRangesByKey(timeRangesKey));
  const wclReports = useAppSelector(selectWCLReportsByEncounterID(encounterID));

  const computeEntries = (timeRange: PlanStateTimeRange) => {
    // Get all the canonical IDs from the roster list
    const canoncalIDs = rosterListEnhanced
      .map((c) => characterToInternalId(c))
      .filter((id) => !timeRange.excludeInternalIds.includes(id))
      .filter((id) => !timeRange.manualPriorities.includes(id.toString?.()));

    // Get all entries from reports corresponding to the time range
    const entries = wclReports
      .reduce((acc: WCLReportTableEntry[], report) => {
        const tables = Object.values(report.tables || {}).filter(
          (t) =>
            timeRange.startTime ===
              t.startTime - (report.startTime as number) &&
            timeRange.endTime === t.endTime - (report.startTime as number),
        );
        return [...acc, ...tables.flatMap((t) => t.entries)];
      }, [])
      .filter((e) => canoncalIDs.includes(e.internalId));

    // Compute the average of the entries
    const canonicalIDMap = new Map<string, { total: number; count: number }>();
    entries.forEach((e) => {
      const key = e.internalId;
      if (!canonicalIDMap.has(key)) {
        canonicalIDMap.set(key, { total: e.total, count: 1 });
      } else {
        const { total, count } = canonicalIDMap.get(key)!;
        canonicalIDMap.set(key, {
          total: total + e.total,
          count: count + 1,
        });
      }
    });

    // Convert in a map
    let entriesAverage: ResultEntry[] = [];
    canonicalIDMap.forEach((value, key) => {
      entriesAverage.push({
        internalId: key,
        total: value.total / value.count,
      });
    });

    // Sort the entries by total
    entriesAverage.sort((a, b) => b.total - a.total);

    return entriesAverage;
  };

  const lines = timeRanges.map((timeRange) => {
    const subTimeRanges: PlanStateTimeRange[] = [];
    for (let i = timeRange.startTime; i < timeRange.endTime; i += 5000) {
      subTimeRanges.push({
        startTime: i + (i === timeRange.startTime ? 0 : 1),
        endTime: Math.min(i + 5000, timeRange.endTime),
        excludeInternalIds: timeRange.excludeInternalIds,
        manualPriorities: timeRange.manualPriorities,
      });
    }

    const children = subTimeRanges.map((subTimeRange) => ({
      entries: computeEntries(subTimeRange),
      startTime: subTimeRange.startTime,
      endTime: subTimeRange.endTime,
      excludeInternalIds: timeRange.excludeInternalIds,
      manualPriorities: timeRange.manualPriorities,
    }));

    // Sum entries from children
    const entries = children.reduce((acc, child) => {
      child.entries.forEach((entry) => {
        const existingEntry = acc.find(
          (e) => e.internalId === entry.internalId,
        );
        if (existingEntry) {
          existingEntry.total += entry.total;
        } else {
          acc.push({ ...entry });
        }
      });
      return acc;
    }, [] as ResultEntry[]);

    entries.sort((a, b) => b.total - a.total);

    return {
      startTime: timeRange.startTime,
      endTime: timeRange.endTime,
      entries,
      excludeInternalIds: timeRange.excludeInternalIds,
      manualPriorities: timeRange.manualPriorities,
      children,
    };
  });

  const linesWithPriority = useMemo(() => {
    return lines.map((line) => {
      const entries: string[] = [];
      for (let index = 0; index < 6; index++) {
        let shiftIndex = 0;
        for (let i = 0; i < index; i++) {
          if (line.manualPriorities[i]) shiftIndex++;
        }

        entries[index] = line.manualPriorities[index]
          ? (line.manualPriorities[index] as string)
          : line.entries[index - shiftIndex]?.internalId;
      }

      line.children.forEach((child) => {
        const childrenEntries: string[] = [];
        for (let index = 0; index < child.entries.length; index++) {
          let shiftIndex = 0;
          for (let i = 0; i < index; i++) {
            if (child.manualPriorities[i] && index < 6) shiftIndex++;
          }

          childrenEntries[index] =
            child.manualPriorities[index] && index < 6
              ? (child.manualPriorities[index] as string)
              : child.entries[index - shiftIndex]?.internalId;
        }

        child.entries = childrenEntries.map((internalId, index) => {
          if (child.manualPriorities[index] === internalId) {
            return {
              internalId,
              total: 0,
              priority: true,
            };
          }
          return child.entries.find((e) => e?.internalId === internalId);
        }) as ResultEntry[];
      });

      return { ...line, entries };
    });
  }, [lines]);

  const internalIdsArray: string[][] = [];

  linesWithPriority.map((line) => {
    for (let i = 0; i < 6; i++) {
      internalIdsArray.push(line.entries.filter((entry) => !!entry));
    }
  });

  return {
    v1: `lirAugStart
${internalIdsArray
  .filter((entry) => entry.length > 0)
  .map((internalIdsArrayLine) => {
    return internalIdsArrayLine
      .map((entry) => {
        const character = rosterListEnhanced.find(
          (character) => characterToInternalId(character) === entry,
        );
        return character?.name;
      })
      .join(' ');
  })
  .join('\n')}
lirAugEnd`,

    v2: linesWithPriority
      .map((line) => {
        return line.children
          .map((child) => {
            if (child.entries.length === 0) return '';
            let line = `${Math.floor(child.startTime / 1000)}:${Math.floor(child.endTime / 1000)}`;
            child.entries.forEach((entry) => {
              const characterName = rosterListEnhanced.find(
                (r) => characterToInternalId(r) === entry.internalId,
              )?.name;
              if (!characterName) return;

              line = `${line} ${characterName}:${entry.priority ? '1' : '0'}:${Math.round(entry.total / 1000)}`;
            });
            return line;
          })
          .filter((line) => line.length > 0)
          .join('\n');
      })
      .flat()
      .filter((line) => line.length > 0)
      .join('\n'),
  };
};
