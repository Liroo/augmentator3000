import { useAppDispatch, useAppSelector } from '@/flux/hooks';
import { rosterAddCharacter } from '@/flux/roster/reducer';
import { selectRosterListEnhanced } from '@/flux/roster/selector';
import { getWCLCharacter } from '@/flux/wcl/action';
import { WCLReport } from '@/wcl/wcl';
import { TeamOutlined } from '@ant-design/icons';
import { Flex, Tooltip } from 'antd';

interface Props {
  report: WCLReport;
}

export default function ViewAddReportTableCellImportRoster({ report }: Props) {
  const dispatch = useAppDispatch();

  const currentRoster = useAppSelector(selectRosterListEnhanced);

  const importRosterFromReport = () => {
    report.rankedCharacters?.forEach((character) => {
      if (
        currentRoster.find(
          (c) =>
            c.name === character.name && c.serverSlug === character.serverSlug,
        )
      )
        return;
      if (character)
        dispatch(
          rosterAddCharacter({
            name: character.name,
            serverSlug: character.serverSlug,
            serverRegion: 'EU',
          }),
        );
      dispatch(
        getWCLCharacter({
          key: `${character.name}-${character.serverSlug}-EU`,
          name: character.name,
          serverSlug: character.serverSlug,
          serverRegion: 'EU',
        }),
      );
    });
    console.log(report, currentRoster);
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
