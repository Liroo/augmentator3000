import { WCLReport, WCLReportFight } from '@/wcl/types';
import { WowRaids } from '@/wow/raid';
import { Flex } from 'antd';
import ViewAddReportTableCellPullsEncounter from './encounter';

interface Props {
  report: WCLReport;
}

export default function ViewAddReportTableCellPulls({ report }: Props) {
  const tree: {
    [encounterID: number]: WCLReportFight[];
  } = {};
  report.fights?.forEach((fight) => {
    // check if fight.encounterID is contained in any WowRaids
    if (!fight?.encounterID) return;
    const isRaidBoss = WowRaids.some((raid) => {
      return raid.encounters.some(
        (encounter) => encounter.id === fight.encounterID,
      );
    });

    if (!isRaidBoss) return;

    if (!tree[fight.encounterID]) tree[fight.encounterID] = [];
    tree[fight.encounterID].push(fight);
  });

  return (
    <Flex
      align="start"
      vertical
      className="no-scrollbar w-full max-w-full cursor-pointer select-none gap-1 overflow-x-scroll"
    >
      {Object.keys(tree).map((encounterID) => {
        return (
          <ViewAddReportTableCellPullsEncounter
            key={encounterID}
            report={report}
            encounterID={parseInt(encounterID)}
            fights={tree[parseInt(encounterID)]}
          />
        );
      })}
    </Flex>
  );
}
