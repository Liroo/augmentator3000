import { useAppDispatch } from '@/flux/hooks';
import { rosterModifyCharacter } from '@/flux/roster/reducer';
import { WCLCharacter } from '@/wcl/wcl';
import { getClassById, WowClassSpec } from '@/wow/class';
import { Select } from 'antd';

interface Props {
  character: WCLCharacter;
}

export default function ViewEditRosterTableCellSpec({ character }: Props) {
  const characterClass = getClassById(character.classID);
  const dispatch = useAppDispatch();

  if (!characterClass) return null;

  return (
    <Select
      onChange={(value) => {
        dispatch(
          rosterModifyCharacter({
            query: character,
            character: {
              name: character.name,
              serverSlug: character.serverSlug,
              serverRegion: character.serverRegion,
              specID: value,
            },
          }),
        );
      }}
      className={`class-${characterClass} w-full`}
      size="small"
      options={WowClassSpec[characterClass].specs.map((spec) => ({
        label: spec.name,
        value: spec.id,
      }))}
      style={{ width: '200px' }}
    />
  );
}
