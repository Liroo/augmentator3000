import { Checkbox } from 'antd';
import { useAppDispatch } from 'flux/hooks';
import { rosterToggleCharacterUse } from 'flux/roster/reducer';
import { RosterCharacter } from 'flux/roster/types';

interface Props {
  rosterCharacter: RosterCharacter;
  canUse?: boolean;
}

export default function RosterTableCellUse({ rosterCharacter, canUse }: Props) {
  const dispatch = useAppDispatch();

  const onClickCheckbox = () => {
    dispatch(rosterToggleCharacterUse(rosterCharacter));
  };

  return (
    <div className="flex justify-center">
      <Checkbox
        checked={rosterCharacter.use}
        onClick={onClickCheckbox}
        disabled={!canUse}
      />
    </div>
  );
}
