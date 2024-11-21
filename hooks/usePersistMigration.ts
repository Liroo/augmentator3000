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

  useEffect(() => {
    const persistAugmentator3000Root = localStorage.getItem(
      'persist:augmentator3000-root',
    );
    const persistAuth = localStorage.getItem('persist:auth');

    if (persistAugmentator3000Root && persistAuth) {
      window.indexedDB.open('localforage', 3).onsuccess = function (event) {
        const db = event.target.result;
        console.log(db);
        const transaction = db.transaction('keyvaluepairs', 'readwrite');

        const objectStore = transaction.objectStore('keyvaluepairs');
        objectStore.put(
          persistAugmentator3000Root,
          'persist:augmentator3000-root',
        );
        objectStore.put(persistAuth, 'persist:auth');

        transaction.oncomplete = function () {
          localStorage.removeItem('persist:augmentator3000-root');
          localStorage.removeItem('persist:auth');
          window.location.reload();
        };
      };
    }
  }, []);
}
