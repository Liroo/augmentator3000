import { useAppSelector } from '@/flux/hooks';
import { selectWCLReportWithFights } from '@/flux/wcl/selector';
import { WCLReport } from '@/wcl/wcl';
import { Table, TableColumnsType, Tooltip } from 'antd';
import ViewAddReportTableCellDelete from './cell/delete';
import ViewAddReportTableCellPulls from './cell/pulls';

const columns: TableColumnsType<WCLReport> = [
  {
    title: 'Title',
    key: 'title',
    render: ({ title, code }) => (
      <Tooltip title={title}>
        <p className="max-w-[140px] truncate font-semibold">{title}</p>
      </Tooltip>
    ),
    width: 150,
  },
  {
    title: 'Pulls',
    key: 'pulls',
    render: (report: WCLReport) => (
      <ViewAddReportTableCellPulls report={report} />
    ),
  },
  {
    title: '',
    key: 'delete',
    render: (report) => <ViewAddReportTableCellDelete report={report} />,
    width: 50,
  },
];

export default function ViewAddReportsTable() {
  const reportWithFights = useAppSelector(selectWCLReportWithFights);

  return (
    <Table
      tableLayout="fixed"
      rowKey={(record) => record.code}
      columns={columns}
      dataSource={reportWithFights}
      pagination={false}
      className="w-full"
    />
  );
}
