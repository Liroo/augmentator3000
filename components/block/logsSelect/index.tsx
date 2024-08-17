import { Collapse, Divider, Typography } from 'antd';
import { useAppSelector } from 'flux/hooks';
import {
  selectPlanBestLogsFightsSelectedByEncounterFormCount,
  selectPlanCustomReportFightsSelectedByEncounterFormCount,
} from 'flux/plan/selector';
import LogsSelectBestLogs from './bestLogs';
import LogsSelectCustomReport from './customReport';

export default function LogsSelect() {
  const customReportCount = useAppSelector(
    selectPlanCustomReportFightsSelectedByEncounterFormCount,
  );
  const { total, unique } = useAppSelector(
    selectPlanBestLogsFightsSelectedByEncounterFormCount,
  );

  return (
    <Collapse
      size="small"
      items={[
        {
          key: 'customLogs',
          label: `📊 Custom Logs (${customReportCount} ${customReportCount > 1 ? 'fights' : 'fight'} selected for this encounter)`,
          children: (
            <>
              <Typography.Text>
                Add custom reports and fights to analyze.
              </Typography.Text>
              <Divider />
              <LogsSelectCustomReport />
            </>
          ),
        },
        {
          key: 'bestLogs',
          label: `📈 Best Logs (${total} ${total > 1 ? 'fights' : 'fight'} selected for this encounter) (${unique} without duplicates)`,
          children: (
            <>
              <Typography.Text>
                Select best logs from your roster.
              </Typography.Text>
              <Divider />
              <LogsSelectBestLogs />
            </>
          ),
        },
      ]}
    />
  );
}
