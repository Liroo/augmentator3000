import useAnalyzerResult from '@/analyzer/useAnalyzerResult';
import { ResultEntry } from '@/types/result';
import { Table, TableColumnsType } from 'antd';
import ViewAnalyzeResultTableCellDamage from './cell/damage';
import ViewAnalyzeResultTableCellExclude from './cell/exclude';
import ViewAnalyzeResultTableCellTimer from './cell/timer';

const columns: TableColumnsType<{
  startTime: number;
  endTime: number;
  entries: ResultEntry[];
  excludeInternalIds: string[];
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
    render: ({ startTime, endTime, excludeInternalIds, children }) =>
      children?.length > 0 ? (
        <ViewAnalyzeResultTableCellExclude
          startTime={startTime}
          endTime={endTime}
          excludeInternalIds={excludeInternalIds}
        />
      ) : null,
  },
];

export default function ViewAnalyzeRosterTable() {
  const results = useAnalyzerResult();

  return (
    <Table
      rowKey={(timeRange) => `${timeRange.startTime}-${timeRange.endTime}`}
      columns={columns}
      dataSource={results}
      pagination={false}
    />
  );
}
