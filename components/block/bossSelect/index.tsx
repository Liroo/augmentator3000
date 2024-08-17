import { Select, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'flux/hooks';
import { setEncounterForm } from 'flux/plan/reducer';
import { selectPlanEncounterForm } from 'flux/plan/selector';
import { Difficulties } from 'game/difficulties';
import {
  Boss,
  getEncounterByEncounterId,
  getRaidByZoneId,
  Raids,
  Zone,
} from 'game/raids';
import Image from 'next/image';
import { logEvent } from 'services/amplitude/analytics';

export default function BossSelect() {
  const dispatch = useAppDispatch();
  const { encounterId, zoneId, difficulty } = useAppSelector(
    selectPlanEncounterForm,
  );

  const raid = getRaidByZoneId(zoneId) as Zone;
  const encounter = getEncounterByEncounterId(encounterId) as Boss;

  return (
    <div>
      <Typography.Title level={5}>👉🏼 Select Boss</Typography.Title>
      <div className="flex gap-[16px]">
        <Select
          style={{ width: 300 }}
          defaultValue={zoneId}
          options={Raids.map((raid) => ({
            label: raid.name,
            value: raid.id,
            icon: raid.icon,
          }))}
          optionRender={(option) => (
            <div className="flex items-center">
              <Image src={option.data.icon} alt="icon" width={20} height={20} />
              <span className="ml-[8px]">{option.data.label}</span>
            </div>
          )}
          labelRender={(label) => (
            <div className="flex items-center">
              <Image src={raid.icon} alt="icon" width={20} height={20} />
              <span className="ml-[8px]">{label.label}</span>
            </div>
          )}
          onChange={(zoneId) => {
            const newRaid = getRaidByZoneId(zoneId) as Zone;
            dispatch(
              setEncounterForm({
                zoneId,
                encounterId: newRaid.encounters[0].id,
              }),
            );
            logEvent('plan', 'select-encounterForm', {
              zoneId,
              encounterId: newRaid.encounters[0].id,
              difficulty,
            });
          }}
        />
        <Select
          style={{ width: 300 }}
          defaultValue={encounterId}
          options={raid.encounters.map((encounter) => ({
            label: encounter.name,
            value: encounter.id,
            icon: encounter.icon,
          }))}
          optionRender={(option) => (
            <div className="flex items-center">
              <Image src={option.data.icon} alt="icon" width={20} height={20} />
              <span className="ml-[8px]">{option.data.label}</span>
            </div>
          )}
          labelRender={(label) => (
            <div className="flex items-center">
              <Image src={encounter.icon} alt="icon" width={20} height={20} />
              <span className="ml-[8px]">{label.label}</span>
            </div>
          )}
          onChange={(encounterId) => {
            logEvent('plan', 'select-encounterForm', {
              zoneId,
              encounterId,
              difficulty,
            });
            dispatch(setEncounterForm({ zoneId, encounterId }));
          }}
        />

        <Select
          style={{ width: 150 }}
          defaultValue={difficulty}
          options={Difficulties.map((difficulty) => ({
            label: difficulty.label,
            value: difficulty.value,
          }))}
          optionRender={(option) => (
            <span className={`difficulty-${option.value}`}>{option.label}</span>
          )}
          labelRender={(label) => (
            <span className={`difficulty-${label.value}`}>{label.label}</span>
          )}
          onChange={(difficulty) => {
            logEvent('plan', 'select-encounterForm', {
              zoneId,
              encounterId,
              difficulty,
            });
            dispatch(setEncounterForm({ difficulty }));
          }}
        />
      </div>
    </div>
  );
}
