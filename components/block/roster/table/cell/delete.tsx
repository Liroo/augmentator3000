import { DeleteOutlined } from '@ant-design/icons';
import { removeCharacterFromExcludedAndPriority } from 'flux/analysis/reducer';
import { removeCharacterFromExcludedAndPriority as removeCharacterFromExcludedAndPriorityCustomEbonMight } from 'flux/customEbonMight/reducer';
import { useAppDispatch } from 'flux/hooks';
import { removeBestLogsFightsSelectedForCharacter } from 'flux/plan/reducer';
import { rosterRemoveCharacter } from 'flux/roster/reducer';
import { RosterCharacter } from 'flux/roster/types';
import { logEvent } from 'services/amplitude/analytics';
import { rosterCharacterToKey } from 'utils/key';

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
        dispatch(removeBestLogsFightsSelectedForCharacter(rosterCharacter));
        dispatch(
          removeCharacterFromExcludedAndPriority(
            rosterCharacterToKey(rosterCharacter),
          ),
        );
        dispatch(
          removeCharacterFromExcludedAndPriorityCustomEbonMight(
            rosterCharacterToKey(rosterCharacter),
          ),
        );
        dispatch(
          removeCharacterFromExcludedAndPriority(
            rosterCharacterToKey(rosterCharacter),
          ),
        );
        dispatch(rosterRemoveCharacter(rosterCharacter));
      }}
    >
      <DeleteOutlined style={{ fontSize: 18, color: '#f5222d' }} />
    </div>
  );
}
