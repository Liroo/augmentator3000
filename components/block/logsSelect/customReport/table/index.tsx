import { Table, TableColumnsType, Tooltip } from 'antd';
import { useAppSelector } from 'flux/hooks';
import { selectWCLReportWithFights } from 'flux/wcl/selector';
import { WCLReport } from 'wcl/types';
import LogsSelectCustomReportTableCellActions from './cell/actions';
import LogsSelectCustomReportTableCellDelete from './cell/delete';
import LogsSelectCustomReportTableCellPulls from './cell/pulls';

const columns: TableColumnsType<WCLReport> = [
  {
    title: 'Title',
    key: 'title',
    render: ({ title }) => (
      <Tooltip title={title}>
        <p className="max-w-[140px] truncate font-semibold">{title}</p>
      </Tooltip>
    ),
    width: 150,
  },
  {
    title: '',
    key: 'actions',
    render: (report) => (
      <LogsSelectCustomReportTableCellActions report={report} />
    ),
    width: 100,
  },
  {
    title: 'Pulls',
    key: 'pulls',
    render: (report: WCLReport) => (
      <LogsSelectCustomReportTableCellPulls report={report} />
    ),
  },
  {
    title: '',
    key: 'delete',
    render: (report) => (
      <LogsSelectCustomReportTableCellDelete report={report} />
    ),
    width: 50,
  },
];

export default function LogsSelectCustomReportTable() {
  const reportWithFights = useAppSelector(selectWCLReportWithFights);

  return (
    <Table
      tableLayout="fixed"
      size="small"
      rowKey={(record) => record.code}
      columns={columns}
      dataSource={reportWithFights}
      pagination={false}
      className="w-full"
    />
  );
}
