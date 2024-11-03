import { Table, TableColumnsType } from 'antd';
import { AnalysisTableRowParent } from 'flux/analysis/types';
import { selectCustomEbonMightTableWithExcludedAndPriority } from 'flux/customEbonMight/selector';
import { useAppSelector } from 'flux/hooks';
import TimeRangeTableCellDelete from './cell/delete';
import TimeRangeTableCellTimeExcluded from './cell/excluded';
import TimeRangeTableCellTimeTarget from './cell/target';
import TimeRangeTableCellTimeRange from './cell/timeRange';

const columns: TableColumnsType<AnalysisTableRowParent> = [
  {
    title: '',
    key: 'delete',
    render: (_row: AnalysisTableRowParent, _: any, rowIndex: number) => (
      <TimeRangeTableCellDelete rowIndex={rowIndex} />
    ),
    width: 50,
  },
  {
    title: 'Time Range',
    key: 'timeRange',
    render: (row: AnalysisTableRowParent) => (
      <TimeRangeTableCellTimeRange
        startTime={row.startTime}
        endTime={row.endTime}
      />
    ),
    width: 150,
  },
  ...new Array(4).fill(0).map((_, index) => ({
    title: `Target ${index + 1}`,
    key: `target-${index}`,
    render: (row: AnalysisTableRowParent, _: any, rowIndex: number) => {
      const prevIndex = index - 1;
      const prevRowEntry = row.entries[prevIndex];

      return (
        <TimeRangeTableCellTimeTarget
          row={row}
          index={index}
          rowIndex={rowIndex}
          disabled={!row.subEntries || (!prevRowEntry && index !== 0)}
        />
      );
    },
    width: 160,
  })),
  {
    title: 'Excluded',
    key: 'excluded',
    render: (row: AnalysisTableRowParent, _: any, rowIndex: number) =>
      !!row.subEntries ? (
        <TimeRangeTableCellTimeExcluded row={row} rowIndex={rowIndex} />
      ) : null,
  },
];

export default function TimeRangeTable() {
  const analysisTable = useAppSelector(
    selectCustomEbonMightTableWithExcludedAndPriority,
  );

  return (
    <Table<AnalysisTableRowParent>
      size="small"
      tableLayout="fixed"
      pagination={false}
      columns={columns}
      dataSource={analysisTable}
      rowKey={(row) => `${row.startTime}-${row.endTime}`}
      className="mt-[12px]"
    />
  );
}
