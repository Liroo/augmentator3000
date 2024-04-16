import { WCLCharacter } from '@/wcl/wcl';
import { getClassById } from '@/wow/class';

interface Props {
  character: WCLCharacter;
}

export default function ViewEditRosterTableCellName({ character }: Props) {
  const characterClass = getClassById(character.classID);

  return <span className={`class-${characterClass}`}>{character.name}</span>;
}
