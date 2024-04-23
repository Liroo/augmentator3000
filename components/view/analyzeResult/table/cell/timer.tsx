import { Flex, Typography } from 'antd';
import moment from 'moment';

interface Props {
  startTime: number;
  endTime: number;
}

export default function ViewAnalyzeResultTableCellTimer({
  startTime,
  endTime,
}: Props) {
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
