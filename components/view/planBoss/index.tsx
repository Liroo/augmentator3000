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
import { Button, Checkbox, Flex, Form, Typography } from 'antd';
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

  const onFinish = ({ includeBestLog }: any) => {
    analyze(includeBestLog);
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
          includeBestLog: false,
        }}
      >
        <ViewPlanBossForm />

        <div className="mt-[16px] w-full">
          <ViewPlanBossTimeRanges />
        </div>

        <Flex align="center" className="mt-[16px]">
          <Form.Item name="includeBestLog" valuePropName="checked">
            <Checkbox>Include best log?</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={isLoading}>
              Compute
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    </section>
  );
}
