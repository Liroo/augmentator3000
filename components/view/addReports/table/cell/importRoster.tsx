import { useAppDispatch, useAppSelector } from '@/flux/hooks';
import { rosterAddCharacter } from '@/flux/roster/reducer';
import { selectRosterListEnhanced } from '@/flux/roster/selector';
import { getWCLCharacter } from '@/flux/wcl/action';
import {
  characterToInternalId,
  playerDetailsClassToClassId,
} from '@/utils/wcl';
import { WCLCharacter, WCLReport } from '@/wcl/wcl';
import { TeamOutlined } from '@ant-design/icons';
import { Flex, Tooltip } from 'antd';

interface Props {
  report: WCLReport;
}

export default function ViewAddReportTableCellImportRoster({ report }: Props) {
  const dispatch = useAppDispatch();

  const currentRoster = useAppSelector(selectRosterListEnhanced);

  const importRosterFromReport = () => {
    report.playerDetails?.forEach((pd) => {
      if (
        currentRoster.find(
          (c) =>
            characterToInternalId(c) ===
            characterToInternalId(pd as any as WCLCharacter),
        )
      )
        return;
      if (pd)
        dispatch(
          rosterAddCharacter({
            name: pd.name,
            serverSlug: pd.serverSlug,
            serverRegion: 'EU',
            classID: playerDetailsClassToClassId(pd.type),
          }),
        );
      dispatch(
        getWCLCharacter({
          key: `${pd.name}-${pd.serverSlug}-EU`,
          name: pd.name,
          serverSlug: pd.serverSlug,
          serverRegion: 'EU',
        }),
      );
    });
  };

  return (
    <Flex
      justify="center"
      align="center"
      onClick={importRosterFromReport}
      className="cursor-pointer select-none"
    >
      <Tooltip title="Import Roster Characters">
        <TeamOutlined style={{ fontSize: 18 }} />
      </Tooltip>
    </Flex>
  );
}
