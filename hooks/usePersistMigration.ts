import { useAppDispatch, useAppSelector } from 'flux/hooks';
import { setEncounterForm } from 'flux/plan/reducer';
import { selectPlanEncounterForm } from 'flux/plan/selector';
import { getEncounterByEncounterId, Raids } from 'game/raids';
import { useEffect } from 'react';

export default function usePersistMigration() {
  const dispatch = useAppDispatch();
  const { encounterId } = useAppSelector(selectPlanEncounterForm);

  useEffect(() => {
    if (getEncounterByEncounterId(encounterId) === undefined) {
      dispatch(
        setEncounterForm({
          zoneId: Raids[0].id,
          encounterId: Raids[0].encounters[0].id,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encounterId]);
}
