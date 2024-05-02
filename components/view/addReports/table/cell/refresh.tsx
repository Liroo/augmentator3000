import { useAppDispatch } from '@/flux/hooks';
import { getWCLReportWithFights } from '@/flux/wcl/action';
import { WCLReport } from '@/wcl/wcl';
import { RedoOutlined } from '@ant-design/icons';
import { Flex, Tooltip } from 'antd';

interface Props {
  report: WCLReport;
}

export default function ViewAddReportTableCellRefresh({ report }: Props) {
  const dispatch = useAppDispatch();

  const importRosterFromReport = () => {
    dispatch(getWCLReportWithFights({ code: report.code }));
  };

  return (
    <Flex
      justify="center"
      align="center"
      onClick={importRosterFromReport}
      className="cursor-pointer select-none"
    >
      <Tooltip title="Refresh log">
        <RedoOutlined style={{ fontSize: 18 }} />
      </Tooltip>
    </Flex>
  );
}
