import { Button, Popconfirm, Typography } from 'antd';
import { selectAnalysisReportFights } from 'flux/analysis/selector';
import { useAppDispatch, useAppSelector } from 'flux/hooks';
import { selectPlanEncounterForm } from 'flux/plan/selector';
import { selectStatusByActionTypeIsLoading } from 'flux/status/selector';
import { getWCLReportsFightsTable } from 'flux/wcl/action';
import { resetReportWithDamageTableByEncounterIdAndDifficulty } from 'flux/wcl/reducer';
import { useMemo } from 'react';
import AnalysisTable from './table';

export default function Analysis() {
  const { encounterId, difficulty } = useAppSelector(selectPlanEncounterForm);
  const reportFights = useAppSelector(selectAnalysisReportFights);

  const [reportFightsCount, fightsCount] = useMemo(() => {
    const values = Object.values(reportFights);
    const reportFightsCount = values.length;
    const fightsCount = values.reduce(
      (acc, item) => acc + item.fights.length,
      0,
    );

    return [reportFightsCount, fightsCount];
  }, [reportFights]);

  const isLoading = useAppSelector(
    selectStatusByActionTypeIsLoading(getWCLReportsFightsTable.typePrefix),
  );

  const dispatch = useAppDispatch();
  const onClickCompute = () => {
    const queries: {
      reportCode: string;
      fightId: number;
      startTime: number;
      endTime: number;
    }[] = [];
    Object.values(reportFights).forEach((report) => {
      report.fights.forEach((fight) => {
        queries.push({
          reportCode: report.code,
          fightId: fight.id,
          startTime: fight.startTime,
          endTime: fight.endTime,
        });
      });
    });

    dispatch(getWCLReportsFightsTable({ queries }));
  };

  const onConfirmResetEncounter = () => {
    dispatch(
      resetReportWithDamageTableByEncounterIdAndDifficulty({
        encounterId,
        difficulty,
      }),
    );
  };

  return (
    <div>
      <Typography.Title level={5}>🪄 Do the magic</Typography.Title>
      <div className="flex items-center justify-between">
        <Button
          type="primary"
          onClick={onClickCompute}
          disabled={isLoading}
          loading={isLoading}
        >
          Compute {fightsCount} {fightsCount > 1 ? 'fights' : 'fight'} in{' '}
          {reportFightsCount} {reportFightsCount > 1 ? 'reports' : 'report'}
        </Button>
        <Popconfirm
          title="Reset results for this encounter"
          description="Are you sure?"
          onConfirm={onConfirmResetEncounter}
          okText="Yes"
          cancelText="No"
          placement="left"
        >
          <Button danger size="small">
            Reset results for this encounter
          </Button>
        </Popconfirm>
      </div>

      <div className="mt-[12px]">
        <AnalysisTable />
      </div>
    </div>
  );
}
