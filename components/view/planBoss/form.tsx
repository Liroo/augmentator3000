import { useAppDispatch, useAppSelector } from '@/flux/hooks';
import { setEncounterForm } from '@/flux/plan/reducer';
import { selectPlanEncounterForm } from '@/flux/plan/selector';
import { WowRaids } from '@/wow/raid';
import { Flex, Form, Image, Select, Space } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { useReducer } from 'react';

export default function ViewPlanBossForm() {
  const form = useFormInstance();
  const { zoneID, encounterID } = useAppSelector(selectPlanEncounterForm);
  const dispatch = useAppDispatch();

  const rerender = useReducer((x) => x + 1, 0)[1];

  return (
    <Space>
      <Form.Item name={'zoneID'}>
        <Select
          style={{ width: '300px' }}
          placeholder="Select Raid"
          options={WowRaids.map((wowRaid) => ({
            label: wowRaid.name,
            value: wowRaid.id,
            image: `/img/warcraft/zones/zone-${wowRaid.id}.png`,
          }))}
          optionRender={(option) => (
            <Flex align="center">
              <Image src={option.data.image} width={20} />
              <span
                role="img"
                aria-label={option.data.label}
                className="ml-[8px]"
              >
                {option.data.label}
              </span>
            </Flex>
          )}
          value={zoneID}
          onChange={(value) => {
            const firstEncounterId = WowRaids.find((raid) => raid.id === value)
              ?.encounters[0].id;

            dispatch(
              setEncounterForm({
                zoneID: value,
                encounterID: firstEncounterId,
                timeRangesKey: `default-${firstEncounterId}`,
              }),
            );
            form.setFieldsValue({
              encounterID: firstEncounterId,
              timeRangesKey: `default-${firstEncounterId}`,
            });
            rerender();
          }}
        />
      </Form.Item>
      <Form.Item name={'encounterID'}>
        <Select
          style={{ width: '300px' }}
          placeholder="Select Boss"
          options={WowRaids.find(
            (wowRaid) => wowRaid.id === zoneID,
          )?.encounters.map((wowRaidBoss) => ({
            label: wowRaidBoss.name,
            value: wowRaidBoss.id,
            image: `/img/warcraft/bosses/${wowRaidBoss.id}-icon.jpg`,
          }))}
          optionRender={(option) => (
            <Flex align="center">
              <Image src={option.data.image} width={20} />
              <span
                role="img"
                aria-label={option.data.label}
                className="ml-[8px]"
              >
                {option.data.label}
              </span>
            </Flex>
          )}
          listHeight={300}
          value={encounterID}
          onChange={(value) => {
            dispatch(
              setEncounterForm({
                zoneID,
                encounterID: value,
                timeRangesKey: `default-${value}`,
              }),
            );
            form.setFieldsValue({
              timeRangesKey: `default-${value}`,
            });
            rerender();
          }}
        />
      </Form.Item>
    </Space>
  );
}
