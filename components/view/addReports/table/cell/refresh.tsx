import { useAppDispatch, useAppSelector } from '@/flux/hooks';
import { StatusEnum } from '@/flux/status/reducer';
import { selectStatusByActionTypeId } from '@/flux/status/selector';
import { getWCLReportWithFights } from '@/flux/wcl/action';
import { WCLReport } from '@/wcl/types';
import { RedoOutlined } from '@ant-design/icons';
import { Flex, Tooltip } from 'antd';

interface Props {
  report: WCLReport;
}

export default function ViewAddReportTableCellRefresh({ report }: Props) {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(
    selectStatusByActionTypeId(getWCLReportWithFights.typePrefix, report.code),
  );

  const importRosterFromReport = () => {
    dispatch(getWCLReportWithFights({ key: report.code, code: report.code }));
  };

  return (
    <Flex
      justify="center"
      align="center"
      onClick={importRosterFromReport}
      className="cursor-pointer select-none"
    >
      <Tooltip title="Refresh log">
        <RedoOutlined
          style={{ fontSize: 18 }}
          spin={status === StatusEnum.Pending}
        />
      </Tooltip>
    </Flex>
  );
}
