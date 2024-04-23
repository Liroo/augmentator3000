import { useAppSelector } from '@/flux/hooks';
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
import ViewAnalyzeResultTableCellTimer from './cell/timer';

const columns: TableColumnsType<{ startTime: number; endTime: number }> = [
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
    render: ({ entries }) => (
      <ViewAnalyzeResultTableCellDamage entries={entries} index={0} />
    ),
    width: 150,
  },
  {
    title: '2nd best target',
    key: 'entry1',
    render: ({ entries }) => (
      <ViewAnalyzeResultTableCellDamage entries={entries} index={1} />
    ),
    width: 150,
  },
  {
    title: '3rd best target',
    key: 'entry2',
    render: ({ entries }) => (
      <ViewAnalyzeResultTableCellDamage entries={entries} index={2} />
    ),
    width: 150,
  },
  {
    title: '4th best target',
    key: 'entry3',
    render: ({ entries }) => (
      <ViewAnalyzeResultTableCellDamage entries={entries} index={3} />
    ),
    width: 150,
  },

  {
    title: '5th best target',
    key: 'entry4',
    render: ({ entries }) => (
      <ViewAnalyzeResultTableCellDamage entries={entries} index={4} />
    ),
    width: 150,
  },

  {
    title: '6th best target',
    key: 'entry5',
    render: ({ entries }) => (
      <ViewAnalyzeResultTableCellDamage entries={entries} index={5} />
    ),
  },
];

export default function ViewAnalyzeRosterTable() {
  const { encounterID } = useAppSelector(selectPlanEncounterForm);
  const { timeRangesKey } = useAppSelector(selectPlanEncounterForm);
  const rosterListEnhanced = useAppSelector(selectRosterListEnhanced);
  const timeRanges = useAppSelector(selectPlanTimeRangesByKey(timeRangesKey));
  const wclReports = useAppSelector(selectWCLReportsByEncounterID(encounterID));

  // Is this optimal? No. So what? It's augmentation time.
  const computeEntries = (timeRange: [number, number]) => {
    const canoncalIDs = rosterListEnhanced
      .map((c) => c.canonicalID)
      .filter((id) => !!id);
    const entries = wclReports
      .reduce((acc: WCLReportTableEntry[], report) => {
        const tables = Object.values(report.tables || {}).filter(
          (t) =>
            timeRange[0] === t.startTime - (report.startTime as number) &&
            timeRange[1] === t.endTime - (report.startTime as number),
        );
        return [...acc, ...tables.flatMap((t) => t.entries)];
      }, [])
      .filter((e) => canoncalIDs.includes(e.canonicalID));

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
    let entriesAverage: ResultEntry[] = [];
    canonicalIDMap.forEach((value, key) => {
      entriesAverage.push({
        canonicalID: key,
        total: value.total / value.count,
      });
    });

    entriesAverage.sort((a, b) => b.total - a.total);

    return entriesAverage;
  };

  const dataSource = useMemo(
    () =>
      timeRanges.map((timeRange) => {
        const subTimeRanges = [];
        for (let i = timeRange[0]; i < timeRange[1]; i += 9000) {
          subTimeRanges.push([
            i + (i === timeRange[0] ? 0 : 1),
            Math.min(i + 9000, timeRange[1]),
          ]);
        }

        return {
          startTime: timeRange[0],
          endTime: timeRange[1],
          entries: computeEntries(timeRange),
          children: subTimeRanges.map((subTimeRange) => ({
            entries: computeEntries(subTimeRange as [number, number]),
            startTime: subTimeRange[0],
            endTime: subTimeRange[1],
          })),
        };
      }),
    [timeRanges, rosterListEnhanced, wclReports],
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
