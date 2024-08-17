import { DeleteOutlined } from '@ant-design/icons';
import { useAppDispatch } from 'flux/hooks';
import { rosterRemoveCharacter } from 'flux/roster/reducer';
import { RosterCharacter } from 'flux/roster/types';
import { logEvent } from 'services/amplitude/analytics';

interface Props {
  rosterCharacter: RosterCharacter;
}

export default function RosterTableCellDelete({ rosterCharacter }: Props) {
  const dispatch = useAppDispatch();

  return (
    <div
      className="flex cursor-pointer select-none items-center justify-center"
      onClick={() => {
        logEvent('home', 'roster-remove', { name: rosterCharacter.name });
        dispatch(rosterRemoveCharacter(rosterCharacter));
      }}
    >
      <DeleteOutlined style={{ fontSize: 18, color: '#f5222d' }} />
    </div>
  );
}
