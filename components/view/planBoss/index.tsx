'use client';
import { useAppSelector } from '@/flux/hooks';
import { selectPlanEncounterForm } from '@/flux/plan/selector';
import { StatusEnum } from '@/flux/status/reducer';
import { selectStatusByActionTypeId } from '@/flux/status/selector';
import {
  getWCLCharactersWithEncounterRankings,
  getWCLReports,
} from '@/flux/wcl/action';
import useAugAnalyzer from '@/hooks/useAugAnalyzer';
import { Button, Form, Typography } from 'antd';
import ViewPlanBossForm from './form';
import ViewPlanBossTimeRanges from './timeRanges';

export default function ViewPlanBoss() {
  const { analyze } = useAugAnalyzer();
  const [form] = Form.useForm();
  const { zoneID, encounterID, timeRangesKey } = useAppSelector(
    selectPlanEncounterForm,
  );
  const { status: getWCLCharactersWithEncounterRankingsStatus } =
    useAppSelector(
      selectStatusByActionTypeId(
        getWCLCharactersWithEncounterRankings.typePrefix,
      ),
    );
  const { status: getWCLReportsStatus } = useAppSelector(
    selectStatusByActionTypeId(getWCLReports.typePrefix),
  );
  const isLoading =
    getWCLCharactersWithEncounterRankingsStatus === StatusEnum.Pending ||
    getWCLReportsStatus === StatusEnum.Pending;

  const onFinish = () => {
    analyze();
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
          <Button
            type="primary"
            htmlType="submit"
            className="mt-[16px]"
            disabled={isLoading}
          >
            Compute
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
}
