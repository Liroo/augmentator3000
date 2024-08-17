import { Button, Typography } from 'antd';
import { useAppSelector } from 'flux/hooks';
import { selectPlanReportFightsSelected } from 'flux/plan/selector';
import { useMemo } from 'react';

export default function Analysis() {
  const reportFights = useAppSelector(selectPlanReportFightsSelected);

  const [reportFightsCount, fightsCount] = useMemo(() => {
    const values = Object.values(reportFights);
    const reportFightsCount = values.length;
    const fightsCount = values.reduce(
      (acc, item) => acc + item.fights.length,
      0,
    );

    return [reportFightsCount, fightsCount];
  }, [reportFights]);

  return (
    <div>
      <Typography.Title level={5}>🪄 Do the magic</Typography.Title>
      <div className="flex items-center justify-between">
        <Button type="primary">
          Compute {fightsCount} {fightsCount > 1 ? 'fights' : 'fight'} in{' '}
          {reportFightsCount} {reportFightsCount > 1 ? 'reports' : 'report'}
        </Button>
        <Button type="primary" danger size="small">
          Reset results for this encounter
        </Button>
      </div>
    </div>
  );
}
