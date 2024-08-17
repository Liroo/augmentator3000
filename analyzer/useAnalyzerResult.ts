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
import { WCLReportTableEntry } from '@/wcl/types';

export default function useAnalyzerResult() {
  const { encounterID, timeRangesKey } = useAppSelector(
    selectPlanEncounterForm,
  );
  const rosterListEnhanced = useAppSelector(selectRosterListEnhanced(true));
  const timeRanges = useAppSelector(selectPlanTimeRangesByKey(timeRangesKey));
  const wclReports = useAppSelector(selectWCLReportsByEncounterID(encounterID));

  const computeEntries = (timeRange: PlanStateTimeRange) => {
    // Get all the characters from the roster list
    const internalIds = rosterListEnhanced
      .map((c) => characterToInternalId(c))
      .filter((id) => !timeRange.excludeInternalIds.includes(id))
      .filter((id) => !timeRange.manualPriorities.includes(id));

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
      .filter((e) => internalIds.includes(characterToInternalId(e as any)));

    // Compute the average of the entries
    const internalIdsMap = new Map<string, { total: number; count: number }>();
    entries.forEach((e) => {
      const key = e.internalId;
      if (!internalIdsMap.has(key)) {
        internalIdsMap.set(key, { total: e.total, count: 1 });
      } else {
        const { total, count } = internalIdsMap.get(key)!;
        // If total is 0, we assume player is dead
        if (total > 0)
          internalIdsMap.set(key, {
            total: total + e.total,
            count: count + 1,
          });
      }
    });

    // Convert in a map
    let entriesAverage: ResultEntry[] = [];
    internalIdsMap.forEach((value, key) => {
      entriesAverage.push({
        internalId: key,
        total: value.total / value.count,
      });
    });

    // Sort the entries by total
    entriesAverage.sort((a, b) => b.total - a.total);

    return entriesAverage;
  };

  const dataSource = timeRanges.map((timeRange) => {
    // Divide time ranges by 9s for each time ranges
    const subTimeRanges: PlanStateTimeRange[] = [];
    for (let i = timeRange.startTime; i < timeRange.endTime; i += 5000) {
      subTimeRanges.push({
        startTime: i + (i === timeRange.startTime ? 0 : 1),
        endTime: Math.min(i + 5000, timeRange.endTime),
        excludeInternalIds: timeRange.excludeInternalIds,
        manualPriorities: timeRange.manualPriorities,
      });
    }

    // For Each sub time range, compute entries
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

  return dataSource;
}
