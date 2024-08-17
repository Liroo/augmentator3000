import { useAppDispatch } from '@/flux/hooks';
import { rosterToggleCharacterUse } from '@/flux/roster/reducer';
import { RosterCharacter } from '@/flux/roster/types';
import { Checkbox } from 'antd';

interface Props {
  rosterCharacter: RosterCharacter;
}

export default function RosterTableCellUse({ rosterCharacter }: Props) {
  const dispatch = useAppDispatch();

  const onClickCheckbox = () => {
    dispatch(rosterToggleCharacterUse(rosterCharacter));
  };

  return (
    <div className="flex justify-center">
      <Checkbox checked={rosterCharacter.use} onClick={onClickCheckbox} />
    </div>
  );
}
