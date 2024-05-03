import { useAppSelector } from '@/flux/hooks';
import { PlanStateTimeRange } from '@/flux/plan/reducer';
import {
  selectPlanEncounterForm,
  selectPlanTimeRangesByKey,
} from '@/flux/plan/selector';
import { selectRosterListEnhanced } from '@/flux/roster/selector';
import { selectWCLReportsByEncounterID } from '@/flux/wcl/selector';
import { ResultEntry } from '@/types/result';
import { WCLReportTableEntry } from '@/wcl/wcl';
import { useMemo } from 'react';

export const useGenerateNoteV2 = () => {
  const { encounterID, timeRangesKey } = useAppSelector(
    selectPlanEncounterForm,
  );
  const rosterListEnhanced = useAppSelector(selectRosterListEnhanced);
  const timeRanges = useAppSelector(selectPlanTimeRangesByKey(timeRangesKey));
  const wclReports = useAppSelector(selectWCLReportsByEncounterID(encounterID));

  // Is this optimal? No. So what? It's augmentation time.
  const computeEntries = (timeRange: PlanStateTimeRange) => {
    // Get all the canonical IDs from the roster list
    const canoncalIDs = rosterListEnhanced
      .map((c) => c.canonicalID)
      .filter((id) => !!id)
      .filter((id) => !timeRange.excludeCanonicalIDs.includes(id))
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
      .filter((e) => canoncalIDs.includes(e.canonicalID));

    // Compute the average of the entries
    const canonicalIDMap = new Map<string, { total: number; count: number }>();
    entries.forEach((e) => {
      const key = e.canonicalID?.toString?.();
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
        canonicalID: parseInt(key),
        total: value.total / value.count,
      });
    });

    // Sort the entries by total
    entriesAverage.sort((a, b) => b.total - a.total);

    return entriesAverage;
  };

  const lines = useMemo(
    () =>
      timeRanges.map((timeRange) => {
        const subTimeRanges: PlanStateTimeRange[] = [];
        for (let i = timeRange.startTime; i < timeRange.endTime; i += 9000) {
          subTimeRanges.push({
            startTime: i + (i === timeRange.startTime ? 0 : 1),
            endTime: Math.min(i + 9000, timeRange.endTime),
            excludeCanonicalIDs: timeRange.excludeCanonicalIDs,
            manualPriorities: timeRange.manualPriorities,
          });
        }

        const children = subTimeRanges.map((subTimeRange) => ({
          entries: computeEntries(subTimeRange),
          startTime: subTimeRange.startTime,
          endTime: subTimeRange.endTime,
          excludeCanonicalIDs: timeRange.excludeCanonicalIDs,
          manualPriorities: timeRange.manualPriorities,
        }));

        return {
          startTime: timeRange.startTime,
          endTime: timeRange.endTime,
          excludeCanonicalIDs: timeRange.excludeCanonicalIDs,
          manualPriorities: timeRange.manualPriorities,
          children,
        };
      }),
    [...timeRanges, rosterListEnhanced, wclReports],
  );

  const linesWithPriority = useMemo(() => {
    return lines.map((line) => {
      line.children.forEach((child) => {
        const childrenEntries: number[] = [];
        for (let index = 0; index < child.entries.length; index++) {
          let shiftIndex = 0;
          for (let i = 0; i < index; i++) {
            if (child.manualPriorities[i] !== 'default' && index < 6)
              shiftIndex++;
          }

          childrenEntries[index] =
            child.manualPriorities[index] !== 'default' && index < 6
              ? parseInt(child.manualPriorities[index])
              : child.entries[index - shiftIndex]?.canonicalID;
        }

        child.entries = childrenEntries.map((canonicalID, index) => {
          if (parseInt(child.manualPriorities[index]) === canonicalID) {
            return {
              canonicalID,
              total: 0,
              priority: true,
            };
          }
          return child.entries.find((e) => e?.canonicalID === canonicalID);
        }) as ResultEntry[];
      });
      return line;
    });
  }, [lines]);

  return `lirAugV2Start
${linesWithPriority
  .map((line) => {
    return line.children
      .map((child) => {
        if (child.entries.length === 0) return '';
        let line = `${child.startTime}:${child.endTime}`;
        child.entries.forEach((entry) => {
          const characterName = rosterListEnhanced.find(
            (r) => r.canonicalID === entry.canonicalID,
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
  .join('\n')}
lirAugV2End`;
};
