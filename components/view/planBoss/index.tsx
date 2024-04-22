'use client';
import { useAppSelector } from '@/flux/hooks';
import { selectPlanEncounterForm } from '@/flux/plan/selector';
import useAugAnalyzer from '@/hooks/useAugAnalyzer';
import { Button, Form, Typography } from 'antd';
import ViewPlanBossForm from './form';
import ViewPlanBossTimeRanges from './timeRanges';

export default function ViewPlanBoss() {
  const { analyzeByEncounterId } = useAugAnalyzer();
  const [form] = Form.useForm();
  const { zoneID, encounterID, timeRangesKey } = useAppSelector(
    selectPlanEncounterForm,
  );

  const onFinish = (values: any) => {
    analyzeByEncounterId(values.encounterID);
  };

  return (
    <section className="mt-[32px]">
      <Typography.Title level={5}>👉🏼 Plan Boss</Typography.Title>

      <Form
        form={form}
        name="planBoss"
        layout="inline"
        onFinish={onFinish}
        initialValues={{
          zoneID,
          encounterID,
          timeRangesKey,
        }}
      >
        <ViewPlanBossForm />

        <div className="mt-[16px] w-full">
          <ViewPlanBossTimeRanges />
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="mt-[16px]">
            Compute
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
}
