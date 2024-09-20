import { Tag, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'flux/hooks';
import {
  addCustomReportFightsSelected,
  removeCustomReportFightsSelected,
  toggleCustomReportFightsSelected,
} from 'flux/plan/reducer';
import { selectPlanCustomReportFightsSelectedByReportCode } from 'flux/plan/selector';
import { Boss, getEncounterByEncounterId } from 'game/raids';
import { useMemo } from 'react';
import { WCLReport, WCLReportFight } from 'services/wcl/types';
import { reportFightToKey } from 'utils/key';

interface Props {
  report: WCLReport;
  encounterId: number;
  difficulty: number;
  fights: WCLReportFight[];
}

export default function LogsSelectCustomReportTableCellPullsEncounter({
  report,
  encounterId,
  difficulty,
  fights,
}: Props) {
  const encounter = getEncounterByEncounterId(encounterId) as Boss;
  const difficultyName = useMemo(() => {
    switch (difficulty) {
      case 1:
        return 'LFR';
      case 3:
        return 'Normal';
      case 4:
        return 'Heroic';
      case 5:
        return 'Mythic';
      default:
        return '';
    }
  }, [difficulty]);

  const fightsGroupedByPhases = useMemo(() => {
    const fightsGroupedByPhases = fights.reduce(
      (acc, fight) => {
        const key = (fight.phaseTransitions || []).length;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(fight);
        return acc;
      },
      {} as Record<number, WCLReportFight[]>,
    );

    return Object.entries(fightsGroupedByPhases).map(([key, value]) => ({
      phase: ~~key,
      fights: value,
    }));
  }, [fights]);

  const selectedFights = useAppSelector(
    selectPlanCustomReportFightsSelectedByReportCode(report.code),
  );

  const dispatch = useAppDispatch();
  const onToggleFight = (fightsIds: string) => {
    dispatch(toggleCustomReportFightsSelected([fightsIds]));
  };
  const onToggleFights = (fightsIds: string[]) => {
    if (fightsIds.some((fightId) => selectedFights.includes(fightId)))
      dispatch(removeCustomReportFightsSelected(fightsIds));
    else dispatch(addCustomReportFightsSelected(fightsIds));
  };

  return (
    <div>
      <Typography.Title level={5} className="!mb-0">
        {encounter.name} -{' '}
        <span className={`difficulty-${difficulty}`}>{difficultyName}</span>
      </Typography.Title>

      <div className="ml-[16px] mt-[4px] flex flex-col gap-[4px] overflow-x-scroll">
        {fightsGroupedByPhases.map((item) => (
          <div key={item.phase} className="flex gap-[8px] whitespace-nowrap">
            {item.phase > 0 && (
              <Typography.Text>Phase {item.phase}</Typography.Text>
            )}
            <div className="flex flex-wrap gap-[4px]">
              {item.fights.length > 1 && (
                <Tag
                  className="cursor-pointer select-none"
                  color={
                    item.fights.every((fight) =>
                      selectedFights.includes(reportFightToKey(report, fight)),
                    )
                      ? 'success'
                      : 'default'
                  }
                  onClick={() => {
                    onToggleFights(
                      item.fights.map((fight) =>
                        reportFightToKey(report, fight),
                      ),
                    );
                  }}
                >
                  Toggle {item.fights.length}{' '}
                  {item.fights.length > 1 ? 'pulls' : 'pull'}
                </Tag>
              )}
              {item.fights.map((fight) => (
                <div key={fight.id}>
                  <Tag
                    className="cursor-pointer select-none"
                    color={
                      selectedFights.includes(reportFightToKey(report, fight))
                        ? 'success'
                        : 'default'
                    }
                    onClick={() => {
                      onToggleFight(reportFightToKey(report, fight));
                    }}
                  >
                    <span className="text-[8px]">
                      {fight.kill ? '✅' : '❌'}
                    </span>
                    <span className="ml-[4px]">
                      {fight.kill ? ' Kill' : `${fight.bossPercentage}%`}
                    </span>
                  </Tag>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
