import { useAppDispatch } from '@/flux/hooks';
import { rosterModifyCharacter } from '@/flux/roster/reducer';
import { RosterCharacter } from '@/flux/roster/types';
import { getClassById } from '@/game/classes';
import { WCLCharacter } from '@/wcl/types';
import { Select } from 'antd';

interface Props {
  rosterCharacter: RosterCharacter;
  WCLCharacter: WCLCharacter;
}

export default function RosterTableCellSpec({
  rosterCharacter,
  WCLCharacter,
}: Props) {
  const characterClass = getClassById(WCLCharacter?.classID);
  const dispatch = useAppDispatch();

  if (!characterClass) return null;

  return (
    <Select
      onChange={(value) => {
        dispatch(
          rosterModifyCharacter({
            query: WCLCharacter,
            character: {
              ...rosterCharacter,
              specId: value,
            },
          }),
        );
      }}
      defaultValue={WCLCharacter.specID}
      className={`class-${characterClass} w-full`}
      size="small"
      options={characterClass.specs.map((spec) => ({
        label: spec.wclSpecName,
        value: spec.id,
      }))}
      style={{ width: '200px' }}
    />
  );
}
