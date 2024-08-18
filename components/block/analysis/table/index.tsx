import { Table, TableColumnsType } from 'antd';
import { selectAnalysisTable } from 'flux/analysis/selector';
import { AnalysisTableRowParent } from 'flux/analysis/types';
import { useAppSelector } from 'flux/hooks';
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
    width: 130,
  },
  ...new Array(6).fill(0).map((_, index) => ({
    title: `Target ${index + 1}`,
    key: `target-${index}`,
    render: (row: AnalysisTableRowParent) => (
      <AnalysisTableCellTimeTarget row={row} index={index} />
    ),
  })),
];

export default function AnalysisTable() {
  const analysisTable = useAppSelector(selectAnalysisTable);

  return (
    <Table<AnalysisTableRowParent>
      tableLayout="fixed"
      pagination={false}
      columns={columns}
      dataSource={analysisTable}
      rowKey={(row) => `${row.startTime}-${row.endTime}`}
    />
  );
}
