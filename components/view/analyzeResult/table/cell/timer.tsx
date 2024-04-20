import { useAppSelector } from '@/flux/hooks';
import { selectPlanTimeRangesByKey } from '@/flux/plan/selector';
import { Flex, Typography } from 'antd';
import moment from 'moment';

interface Props {
  timeRangesIndex: number;
}

export default function ViewAnalyzeResultTableCellTimer({
  timeRangesIndex,
}: Props) {
  const timeRanges = useAppSelector(selectPlanTimeRangesByKey());
  const [startTime, endTime] = timeRanges[timeRangesIndex];
  const start = moment(startTime).format('mm:ss');
  const end = moment(endTime).format('mm:ss');

  return (
    <Flex justify="start" align="center">
      <Typography.Text>
        {start} - {end}
      </Typography.Text>
    </Flex>
  );
}
