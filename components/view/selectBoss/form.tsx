import useAugAnalyzer from '@/hooks/useAugAnalyzer';
import { WowRaids } from '@/wow/raid';
import { Button, Flex, Form, Image, Select, Space } from 'antd';
import { useReducer } from 'react';

export default function ViewSelectBossForm() {
  const { analyzeByEncounterId } = useAugAnalyzer();

  const [form] = Form.useForm();
  const zoneID = form.getFieldValue('zoneID');
  const rerender = useReducer((x) => x + 1, 0)[1];

  const onFinish = (values: any) => {
    analyzeByEncounterId(values.encounterID);
  };

  return (
    <Form
      form={form}
      name="selectBoss"
      layout="inline"
      onFinish={onFinish}
      initialValues={{
        zoneID: WowRaids[0].id,
        encounterID: WowRaids[0].encounters[0].id,
      }}
    >
      <Space>
        <Form.Item name={'zoneID'}>
          <Select
            style={{ width: '400px' }}
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
            onChange={(value) => {
              form.setFieldValue(
                'encounterID',
                WowRaids.find((raid) => raid.id === value)?.encounters[0].id,
              );
              rerender();
            }}
          />
        </Form.Item>
        <Form.Item name={'encounterID'}>
          <Select
            style={{ width: '400px' }}
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
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Compute
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
}
