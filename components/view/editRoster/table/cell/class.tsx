import { WCLCharacter } from '@/wcl/wcl';
import { getClassById, WowClassSpec } from '@/wow/class';

interface Props {
  character: WCLCharacter;
}

export default function ViewEditRosterTableCellClass({ character }: Props) {
  const characterClass = getClassById(character.classID);
  const characterClassName = characterClass
    ? WowClassSpec[characterClass].name
    : '';

  return (
    <span className={`class-${characterClass}`}>{characterClassName}</span>
  );
}
