import { Typography } from 'antd';
import moment from 'moment';

type Props = {
  startTime: number;
  endTime: number;
};

export default function TimeRangeTableCellTimeRange({
  startTime,
  endTime,
}: Props) {
  const start = moment(startTime).format('mm:ss');
  const end = moment(endTime).format('mm:ss');

  return (
    <div className="flex items-center justify-start">
      <Typography.Text>
        {start} - {end}
      </Typography.Text>
    </div>
  );
}
