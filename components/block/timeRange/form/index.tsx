import {
  Button,
  Form,
  InputNumber,
  notification,
  TimePicker,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { setTimeRange } from 'flux/customEbonMight/reducer';
import { selectCustomEbonMightTimeRanges } from 'flux/customEbonMight/selector';
import { useAppDispatch, useAppSelector } from 'flux/hooks';
import { selectPlanEncounterForm } from 'flux/plan/selector';
import { generatePossibleTimeRanges } from 'utils/analysis';
import { encounterToKey } from 'utils/key';
import AnalysisFormExcluded from './excluded';

const { startTimeRanges, endTimeRanges } = generatePossibleTimeRanges(
  20 * 60 * 1000,
  0,
);

export default function TimeRangeForm() {
  const [api, contextHolder] = notification.useNotification();

  const dispatch = useAppDispatch();
  const timeRanges = useAppSelector(selectCustomEbonMightTimeRanges);
  const encounterForm = useAppSelector(selectPlanEncounterForm);

  const [form] = Form.useForm<{ startTime: dayjs.Dayjs; duration: number }>();

  const startTimeValue = Form.useWatch('startTime', form);
  const durationValue = Form.useWatch('duration', form);

  const startTime = startTimeValue
    ? ((startTimeValue as dayjs.Dayjs).minute() * 60 +
        (startTimeValue as dayjs.Dayjs).second()) *
      1000
    : 0;
  const duration = durationValue || 0;
  const endTime = startTime + duration * 1000;

  const closestStartTime = startTimeRanges.reduce((prev, curr) =>
    Math.abs(curr - startTime) < Math.abs(prev - startTime) ? curr : prev,
  );
  const closestEndTime = endTimeRanges.reduce((prev, curr) =>
    Math.abs(curr - endTime) < Math.abs(prev - endTime) ? curr : prev,
  );

  const onFinish = () => {
    // check if there is no conflict with existing time range
    if (
      timeRanges.some(
        (timeRange) =>
          (startTime >= timeRange.startTime &&
            startTime <= timeRange.endTime) ||
          (endTime >= timeRange.startTime && endTime <= timeRange.endTime) ||
          (timeRange.startTime >= startTime &&
            timeRange.startTime <= endTime) ||
          (timeRange.endTime >= startTime && timeRange.endTime <= endTime),
      )
    ) {
      api.error({
        message: 'Conflict',
        description:
          'The time range you are trying to add is conflicting with existing time range',
        duration: 5,
      });
      return;
    }

    dispatch(
      setTimeRange({
        key: encounterToKey(
          encounterForm.encounterId,
          encounterForm.difficulty,
        ),
        timeRange: {
          startTime: closestStartTime,
          endTime: closestEndTime,
        },
      }),
    );
  };

  return (
    <div className="flex w-full justify-between">
      {contextHolder}

      <Form
        form={form}
        size="small"
        onFinish={onFinish}
        initialValues={{
          startTime: dayjs('00:05', 'mm:ss'),
          duration: 25,
        }}
      >
        <div className="flex flex-col items-start gap-[4px]">
          <div className="flex items-end gap-[8px]">
            <Form.Item name="startTime" className="!mb-0">
              <TimePicker size="small" format="mm:ss" />
            </Form.Item>
            <Typography.Text>Ebon Might start</Typography.Text>
          </div>
          <div className="flex items-end gap-[8px]">
            <Form.Item name="duration" className="!mb-0">
              <InputNumber size="small" min={25} max={100} step={1} />
            </Form.Item>
            <Typography.Text>Duration in second</Typography.Text>
          </div>
          <Typography.Text>
            Timer preview: {dayjs(closestStartTime).format('mm:ss')} -{' '}
            {dayjs(closestEndTime + 1).format('mm:ss')}
          </Typography.Text>
          <Button
            htmlType="submit"
            type="primary"
            size="small"
            className="w-auto"
          >
            Add timer
          </Button>
        </div>
      </Form>
      <div className="flex items-end gap-[8px]">
        <Typography.Text>Used for bulk update</Typography.Text>
        <AnalysisFormExcluded />
      </div>
    </div>
  );
}
