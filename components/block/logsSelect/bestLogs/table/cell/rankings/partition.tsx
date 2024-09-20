import { Tag, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'flux/hooks';
import { toggleBestLogsFightsSelected } from 'flux/plan/reducer';
import { selectPlanBestLogsFightsSelectedByCharacterAndPartition } from 'flux/plan/selector';
import moment from 'moment';
import { WCLCharacter, WCLCharacterEncounterRanking } from 'services/wcl/types';
import { encounterRankingRankToKey, rosterCharacterToKey } from 'utils/key';

interface Props {
  WCLCharacter: WCLCharacter;
  partition: number;
  encounterId: number;
  difficulty: number;
  encounterRankings: WCLCharacterEncounterRanking;
}

export default function LogsSelectBestLogsTableCellRankingsPartition({
  WCLCharacter,
  partition,
  encounterId,
  difficulty,
  encounterRankings,
}: Props) {
  const dispatch = useAppDispatch();
  const onToggleFights = (fightsIds: string[]) => {
    dispatch(toggleBestLogsFightsSelected(fightsIds));
  };

  const selectedFights = useAppSelector(
    selectPlanBestLogsFightsSelectedByCharacterAndPartition(
      rosterCharacterToKey(WCLCharacter),
      partition,
    ),
  );

  if (!encounterRankings || (encounterRankings.ranks || []).length === 0)
    return null;

  return (
    <div className="flex whitespace-nowrap">
      <Typography.Text>
        {partition === 0 ? 'current partition' : `partition ${partition}`}
      </Typography.Text>
      <div className="ml-[8px] flex flex-wrap gap-[4px]">
        {[...encounterRankings.ranks]
          .sort((a, b) => b.amount - a.amount)
          .map((rank) => {
            const duration = moment.duration(rank.duration, 'milliseconds');
            let cssClassColor = 'rank-common';
            const percent = Math.round(rank.todayPercent);
            if (percent < 25) cssClassColor = 'rank-common';
            else if (percent < 50) cssClassColor = 'rank-uncommon';
            else if (percent < 75) cssClassColor = 'rank-rare';
            else if (percent < 95) cssClassColor = 'rank-epic';
            else if (percent < 99) cssClassColor = 'rank-legendary';
            else if (percent < 100) cssClassColor = 'rank-astounding';
            else cssClassColor = 'rank-artifact';

            return (
              <Tag
                key={rank.startTime}
                className="cursor-pointer select-none"
                color={
                  selectedFights.includes(
                    encounterRankingRankToKey(
                      WCLCharacter,
                      encounterId,
                      difficulty,
                      partition,
                      rank,
                    ),
                  )
                    ? 'success'
                    : 'default'
                }
                onClick={() => {
                  onToggleFights([
                    encounterRankingRankToKey(
                      WCLCharacter,
                      encounterId,
                      difficulty,
                      partition,
                      rank,
                    ),
                  ]);
                }}
              >
                <span className={cssClassColor}>
                  {Math.round(rank.todayPercent)}
                </span>
                {' - '}
                {moment.utc(duration.as('milliseconds')).format('mm:ss')}
                {' - '}
                {new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(rank.amount)}{' '}
                dps
              </Tag>
            );
          })}
      </div>
    </div>
  );
}
