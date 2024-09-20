import { DeleteOutlined } from '@ant-design/icons';
import { useAppDispatch } from 'flux/hooks';
import { removeCustomReportFightsSelected } from 'flux/plan/reducer';
import { removeReportWithFight } from 'flux/wcl/reducer';
import { logEvent } from 'services/amplitude/analytics';
import { WCLReport } from 'services/wcl/types';
import { reportFightToKey } from 'utils/key';

interface Props {
  report: WCLReport;
}

export default function LogsSelectCustomReportTableCellDelete({
  report,
}: Props) {
  const dispatch = useAppDispatch();

  const onDeleteReport = () => {
    logEvent('home', 'delete-report', { report: report.code });
    const fightsIds = (report.fights || []).map((fight) =>
      reportFightToKey(report, fight),
    );
    dispatch(removeCustomReportFightsSelected(fightsIds));
    dispatch(removeReportWithFight(report.code));
  };

  return (
    <div
      className="flex cursor-pointer select-none items-center justify-center"
      onClick={onDeleteReport}
    >
      <DeleteOutlined style={{ fontSize: 18, color: '#f5222d' }} />
    </div>
  );
}
