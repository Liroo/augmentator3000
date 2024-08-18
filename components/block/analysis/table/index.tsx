import { Table, TableColumnsType } from 'antd';
import { selectAnalysisTableWithExcludedAndPriority } from 'flux/analysis/selector';
import { AnalysisTableRowParent } from 'flux/analysis/types';
import { useAppSelector } from 'flux/hooks';
import AnalysisTableCellTimeExcluded from './cell/excluded';
import AnalysisTableCellTimeTarget from './cell/target';
import AnalysisTableCellTimeRange from './cell/timeRange';

const columns: TableColumnsType<AnalysisTableRowParent> = [
  {
    title: 'Time Range',
    key: 'timeRange',
    render: (row: AnalysisTableRowParent) => (
      <AnalysisTableCellTimeRange
        startTime={row.startTime}
        endTime={row.endTime}
      />
    ),
    width: 150,
  },
  ...new Array(6).fill(0).map((_, index) => ({
    title: `Target ${index + 1}`,
    key: `target-${index}`,
    render: (row: AnalysisTableRowParent, _: any, rowIndex: number) => {
      const prevIndex = index - 1;
      const prevRowEntry = row.entries[prevIndex];

      return (
        <AnalysisTableCellTimeTarget
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
        <AnalysisTableCellTimeExcluded row={row} rowIndex={rowIndex} />
      ) : null,
  },
];

export default function AnalysisTable() {
  const analysisTable = useAppSelector(
    selectAnalysisTableWithExcludedAndPriority,
  );

  return (
    <Table<AnalysisTableRowParent>
      size="small"
      tableLayout="fixed"
      pagination={false}
      columns={columns}
      dataSource={analysisTable}
      rowKey={(row) => `${row.startTime}-${row.endTime}`}
      expandable={{
        childrenColumnName: 'subEntries',
      }}
    />
  );
}
