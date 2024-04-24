import { useAppDispatch, useAppSelector } from '@/flux/hooks';
import { setSelectedFightsFromReportWithFights } from '@/flux/plan/reducer';
import { selectPlanSelectedFightsFromReportWithFightsByReportCode } from '@/flux/plan/selector';
import { WCLReport, WCLReportFight } from '@/wcl/wcl';
import { WowRaids } from '@/wow/raid';
import { Flex, Tag } from 'antd';

interface Props {
  report: WCLReport;
  encounterID: number;
  fights: WCLReportFight[];
}

export default function ViewAddReportTableCellPullsEncounter({
  report,
  encounterID,
  fights,
}: Props) {
  const dispatch = useAppDispatch();
  const planSelectedFightsFromReportWithFights = useAppSelector(
    selectPlanSelectedFightsFromReportWithFightsByReportCode(report.code),
  );
  const raid = WowRaids.find((raid) => {
    return raid.encounters.some((encounter) => encounter.id === encounterID);
  });
  const encounter = raid?.encounters.find(
    (encounter) => encounter.id === encounterID,
  );

  const handleTagClick = (fightID: number) => {
    const newPlanSelectedFightsFromReportWithFights = [
      ...planSelectedFightsFromReportWithFights,
    ];

    if (newPlanSelectedFightsFromReportWithFights.includes(fightID)) {
      const index = newPlanSelectedFightsFromReportWithFights.indexOf(fightID);
      newPlanSelectedFightsFromReportWithFights.splice(index, 1);
    } else {
      newPlanSelectedFightsFromReportWithFights.push(fightID);
    }

    dispatch(
      setSelectedFightsFromReportWithFights({
        code: report.code,
        fights: newPlanSelectedFightsFromReportWithFights,
      }),
    );
  };

  const isAllFightsSelected = fights.every((fight) => {
    return planSelectedFightsFromReportWithFights.includes(fight.id);
  });

  const handleTagAllClick = () => {
    const newPlanSelectedFightsFromReportWithFights = [
      ...planSelectedFightsFromReportWithFights,
    ];

    if (isAllFightsSelected) {
      fights.forEach((fight) => {
        const index = newPlanSelectedFightsFromReportWithFights.indexOf(
          fight.id,
        );
        newPlanSelectedFightsFromReportWithFights.splice(index, 1);
      });
    } else {
      fights.forEach((fight) => {
        if (newPlanSelectedFightsFromReportWithFights.includes(fight.id))
          return;
        newPlanSelectedFightsFromReportWithFights.push(fight.id);
      });
    }

    dispatch(
      setSelectedFightsFromReportWithFights({
        code: report.code,
        fights: newPlanSelectedFightsFromReportWithFights,
      }),
    );
  };

  return (
    <Flex align="center">
      <p className="whitespace-nowrap">
        {encounter?.name} ({fights.length} pulls):
      </p>
      <div className="ml-[16px] flex">
        <Tag
          color={isAllFightsSelected ? 'success' : ''}
          onClick={handleTagAllClick}
        >
          {isAllFightsSelected ? 'Deselect All' : 'Select All'}
        </Tag>

        {fights.map((fight) => {
          return (
            <Tag
              key={fight.startTime}
              color={
                planSelectedFightsFromReportWithFights.includes(fight.id)
                  ? 'success'
                  : ''
              }
              onClick={() => handleTagClick(fight.id)}
            >
              {fight.kill ? 'Kill' : fight.bossPercentage + '%'}{' '}
              {fight.kill ? '✅' : '❌'}
            </Tag>
          );
        })}
      </div>
    </Flex>
  );
}
