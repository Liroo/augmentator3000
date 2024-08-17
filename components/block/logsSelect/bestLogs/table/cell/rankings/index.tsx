import { useAppSelector } from '@/flux/hooks';
import { selectPlanEncounterForm } from '@/flux/plan/selector';
import { getDataFromEncouterRankingKey } from '@/utils/report';
import { WCLCharacter, WCLCharacterEncounterRanking } from '@/wcl/types';
import { useMemo } from 'react';
import LogsSelectBestLogsTableCellRankingsPartition from './partition';

interface Props {
  WCLCharacter: WCLCharacter;
}

export default function LogsSelectBestLogsTableCellRankings({
  WCLCharacter,
}: Props) {
  const { encounterId, difficulty } = useAppSelector(selectPlanEncounterForm);

  const encounterRankings: [string, WCLCharacterEncounterRanking][] =
    useMemo(() => {
      return Object.entries(WCLCharacter?.encounterRankings || {})
        .filter(([key]) => {
          const { encounterId: rEncounterId, difficulty: rDifficulty } =
            getDataFromEncouterRankingKey(key);

          return encounterId === rEncounterId && difficulty === rDifficulty;
        })
        .map(([key, value]) => {
          const { partition } = getDataFromEncouterRankingKey(key);
          return [partition, value];
        });
    }, [WCLCharacter, encounterId, difficulty]);

  return (
    <div className="no-scrollbar flex flex-col gap-[8px] overflow-x-scroll">
      {encounterRankings.map(([partition, item]) => (
        <LogsSelectBestLogsTableCellRankingsPartition
          key={`${encounterId}-${difficulty}-${partition}`}
          WCLCharacter={WCLCharacter}
          partition={~~partition}
          encounterId={encounterId}
          difficulty={difficulty}
          encounterRankings={item}
        />
      ))}
    </div>
  );
}
