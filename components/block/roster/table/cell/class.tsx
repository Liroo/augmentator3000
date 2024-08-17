import { getClassById } from 'game/classes';
import { WCLCharacter } from 'services/wcl/types';

interface Props {
  WCLCharacter: WCLCharacter;
}

export default function RosterTableCellClass({ WCLCharacter }: Props) {
  const characterClass = getClassById(WCLCharacter?.classID);

  if (!characterClass) return null;

  return (
    <span className={`classID-${characterClass.id}`}>
      {characterClass.name}
    </span>
  );
}
