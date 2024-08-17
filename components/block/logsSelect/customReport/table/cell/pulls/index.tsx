import { useAppSelector } from '@/flux/hooks';
import {
  selectPlanEncounterForm,
  selectPlanFilterCustomReportByEncouterId,
} from '@/flux/plan/selector';
import { WCLReport, WCLReportFight } from '@/wcl/types';
import { useMemo } from 'react';
import LogsSelectCustomReportTableCellPullsEncounter from './encounter';

interface Props {
  report: WCLReport;
}

export default function LogsSelectCustomReportTableCellPulls({
  report,
}: Props) {
  const filterCustomReportByEncouterId = useAppSelector(
    selectPlanFilterCustomReportByEncouterId,
  );
  const { encounterId, difficulty } = useAppSelector(selectPlanEncounterForm);

  const fightsGroupedByEncounterIdAndDifficulty = useMemo(() => {
    const fights = (report.fights as WCLReportFight[]).reduce(
      (acc, fight) => {
        if (
          filterCustomReportByEncouterId &&
          (encounterId !== fight.encounterID || difficulty !== fight.difficulty)
        )
          return acc;

        const key = `${fight.encounterID}-${fight.difficulty}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(fight);
        return acc;
      },
      {} as Record<string, WCLReport['fights']>,
    );

    const fightsArray = Object.entries(fights).map(([key, value]) => ({
      encounterId: ~~key.split('-')[0],
      difficulty: ~~key.split('-')[1],
      fights: value as WCLReportFight[],
    }));

    return fightsArray.sort(
      (a, b) => a.fights[0].startTime - b.fights[0].startTime,
    );
  }, [report.fights, filterCustomReportByEncouterId, encounterId, difficulty]);

  if ((report.fights || []).length === 0) return null;

  return (
    <div className="flex flex-col gap-[8px]">
      {fightsGroupedByEncounterIdAndDifficulty.map((item) => (
        <LogsSelectCustomReportTableCellPullsEncounter
          key={`${item.encounterId}-${item.difficulty}`}
          report={report}
          encounterId={item.encounterId}
          difficulty={item.difficulty}
          fights={item.fights}
        />
      ))}
      {fightsGroupedByEncounterIdAndDifficulty.length === 0 && (
        <div className="text-gray-500">
          No pulls found matching these criteria
        </div>
      )}
    </div>
  );
}
