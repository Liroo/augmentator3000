import { Button, Form, Select, Tooltip } from 'antd';
import { useAppDispatch, useAppSelector } from 'flux/hooks';
import { resetBestLogsFightsSelected } from 'flux/plan/reducer';
import { selectPlanEncounterForm } from 'flux/plan/selector';
import { selectStatusByActionTypeIsLoading } from 'flux/status/selector';
import { getWCLCharactersEncounterRankings } from 'flux/wcl/action';
import { resetEncounterRankings } from 'flux/wcl/reducer';
import { getRaidByZoneId, Zone } from 'game/raids';
import { useEffect, useMemo } from 'react';
import { logEvent } from 'services/amplitude/analytics';

export default function LogsSelectBestLogsForm() {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const isLoading = useAppSelector(
    selectStatusByActionTypeIsLoading(
      getWCLCharactersEncounterRankings.typePrefix,
    ),
  );
  const { zoneId, encounterId, difficulty } = useAppSelector(
    selectPlanEncounterForm,
  );

  const raid = useMemo(() => getRaidByZoneId(zoneId), [zoneId]) as Zone;

  useEffect(() => {
    form.setFieldValue('partitions', ['0']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoneId]);

  const onFinish = async (values: any) => {
    logEvent('home', 'best-logs', {
      encounterId,
      difficulty,
      partitions: values.partitions,
    });
    dispatch(
      getWCLCharactersEncounterRankings({
        encounterId,
        difficulty,
        partitions: values.partitions,
      }),
    );
  };

  const partitions = useMemo(() => {
    if (!raid.partition) return ['0'];

    const partitions = ['-1'];
    for (let i = 1; i <= raid.partition; i++) {
      partitions.push(i.toString());
    }
    partitions.push('0');
    return partitions;
  }, [raid]);

  if (!raid.partition) return null;

  return (
    <div className="flex items-center justify-between">
      <Form form={form} name="bestLogsForm" layout="inline" onFinish={onFinish}>
        {raid.partition ? (
          <Tooltip title="WarcraftLogs partitions (represent the patches)">
            <Form.Item
              name="partitions"
              rules={[
                {
                  required: true,
                  message: 'At least one partition is required',
                },
              ]}
              initialValue={['0']}
            >
              <Select
                mode="multiple"
                style={{ width: '400px' }}
                placeholder="Please select"
                options={[
                  ...partitions.map((partition) => ({
                    label: `${partition === '0' ? 'current' : partition}`,
                    value: partition,
                  })),
                ]}
              />
            </Form.Item>
          </Tooltip>
        ) : null}
        <Button
          type="primary"
          htmlType="submit"
          disabled={isLoading}
          loading={isLoading}
        >
          Refresh Best Logs for current encounter
        </Button>
      </Form>
      <Button
        type="primary"
        danger
        size="small"
        onClick={() => {
          dispatch(resetBestLogsFightsSelected());
          dispatch(resetEncounterRankings());
        }}
      >
        Reset rankings
      </Button>
    </div>
  );
}
