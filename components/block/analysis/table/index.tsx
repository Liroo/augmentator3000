import { Table, TableColumnsType } from 'antd';
import { selectAnalysisTableWithExcluded } from 'flux/analysis/selector';
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
    render: (row: AnalysisTableRowParent) => (
      <AnalysisTableCellTimeTarget row={row} index={index} />
    ),
    width: 160,
  })),
  {
    title: 'Excluded',
    key: 'excluded',
    render: (row: AnalysisTableRowParent, _, index: number) =>
      !!row.subEntries ? (
        <AnalysisTableCellTimeExcluded row={row} rowIndex={index} />
      ) : null,
  },
];

export default function AnalysisTable() {
  const analysisTable = useAppSelector(selectAnalysisTableWithExcluded);

  // console.log(analysisTable);

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
