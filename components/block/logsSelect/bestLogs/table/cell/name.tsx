import { RosterCharacter } from 'flux/roster/types';
import { getClassById } from 'game/classes';
import { WCLCharacter } from 'wcl/types';

interface Props {
  rosterCharacter: RosterCharacter;
  WCLCharacter: WCLCharacter;
}

export default function LogsSelectBestLogsTableCellName({
  rosterCharacter,
  WCLCharacter,
}: Props) {
  const characterClass = getClassById(WCLCharacter?.classID);

  return (
    <span className={`classID-${characterClass?.id}`}>
      {rosterCharacter.name}
    </span>
  );
}
