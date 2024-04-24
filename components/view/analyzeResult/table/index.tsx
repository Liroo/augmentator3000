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
import { Table, TableColumnsType } from 'antd';
import { useMemo } from 'react';
import ViewAnalyzeResultTableCellDamage from './cell/damage';
import ViewAnalyzeResultTableCellExclude from './cell/exclude';
import ViewAnalyzeResultTableCellTimer from './cell/timer';

const columns: TableColumnsType<{
  startTime: number;
  endTime: number;
  entries: ResultEntry[];
  excludeCanonicalIDs: string[];
}> = [
  {
    title: 'Time Range',
    key: 'timeRange',
    render: ({ startTime, endTime }) => (
      <ViewAnalyzeResultTableCellTimer
        startTime={startTime}
        endTime={endTime}
      />
    ),
    width: 150,
    fixed: 'left',
  },
  {
    title: 'Best target',
    key: 'entry0',
    render: ({ entries, startTime, endTime, manualPriorities, children }) => (
      <ViewAnalyzeResultTableCellDamage
        startTime={startTime}
        endTime={endTime}
        entries={entries}
        index={0}
        canEdit={children?.length > 0}
        manualPriorities={manualPriorities}
      />
    ),
    width: 170,
  },
  {
    title: '2nd best target',
    key: 'entry1',
    render: ({ entries, startTime, endTime, manualPriorities, children }) => (
      <ViewAnalyzeResultTableCellDamage
        startTime={startTime}
        endTime={endTime}
        entries={entries}
        index={1}
        canEdit={children?.length > 0}
        manualPriorities={manualPriorities}
      />
    ),
    width: 170,
  },
  {
    title: '3rd best target',
    key: 'entry2',
    render: ({ entries, startTime, endTime, manualPriorities, children }) => (
      <ViewAnalyzeResultTableCellDamage
        startTime={startTime}
        endTime={endTime}
        entries={entries}
        index={2}
        canEdit={children?.length > 0}
        manualPriorities={manualPriorities}
      />
    ),
    width: 170,
  },
  {
    title: '4th best target',
    key: 'entry3',
    render: ({ entries, startTime, endTime, manualPriorities, children }) => (
      <ViewAnalyzeResultTableCellDamage
        startTime={startTime}
        endTime={endTime}
        entries={entries}
        index={3}
        canEdit={children?.length > 0}
        manualPriorities={manualPriorities}
      />
    ),
    width: 170,
  },
  {
    title: '5th best target',
    key: 'entry4',
    render: ({ entries, startTime, endTime, manualPriorities, children }) => (
      <ViewAnalyzeResultTableCellDamage
        startTime={startTime}
        endTime={endTime}
        entries={entries}
        index={4}
        canEdit={children?.length > 0}
        manualPriorities={manualPriorities}
      />
    ),
    width: 170,
  },
  {
    title: '6th best target',
    key: 'entry5',
    render: ({ entries, startTime, endTime, manualPriorities, children }) => (
      <ViewAnalyzeResultTableCellDamage
        startTime={startTime}
        endTime={endTime}
        entries={entries}
        index={5}
        canEdit={children?.length > 0}
        manualPriorities={manualPriorities}
      />
    ),
    width: 170,
  },
  {
    title: 'Exclude characters',
    key: 'exclude',
    render: ({ startTime, endTime, excludeCanonicalIDs, children }) =>
      children?.length > 0 ? (
        <ViewAnalyzeResultTableCellExclude
          startTime={startTime}
          endTime={endTime}
          excludeCanonicalIDs={excludeCanonicalIDs}
        />
      ) : null,
  },
];

export default function ViewAnalyzeRosterTable() {
  const { encounterID } = useAppSelector(selectPlanEncounterForm);
  const { timeRangesKey } = useAppSelector(selectPlanEncounterForm);
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
      .filter((e) => canoncalIDs.includes(e.canonicalID));

    // Compute the average of the entries
    const canonicalIDMap = new Map<string, { total: number; count: number }>();
    entries.forEach((e) => {
      const key = e.canonicalID;
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
        canonicalID: key,
        total: value.total / value.count,
      });
    });

    // Sort the entries by total
    entriesAverage.sort((a, b) => b.total - a.total);

    return entriesAverage;
  };

  const dataSource = useMemo(
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

        // Sum entries from children
        const entries = children.reduce((acc, child) => {
          child.entries.forEach((entry) => {
            const existingEntry = acc.find(
              (e) => e.canonicalID === entry.canonicalID,
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
          excludeCanonicalIDs: timeRange.excludeCanonicalIDs,
          manualPriorities: timeRange.manualPriorities,
          children,
        };
      }),
    [...timeRanges, rosterListEnhanced, wclReports],
  );

  return (
    <Table
      rowKey={(timeRange) => `${timeRange.startTime}-${timeRange.endTime}`}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
    />
  );
}
