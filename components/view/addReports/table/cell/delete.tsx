import { useAppDispatch } from '@/flux/hooks';
import { removeReportWithFight } from '@/flux/wcl/reducer';
import { WCLReport } from '@/wcl/wcl';
import { DeleteOutlined } from '@ant-design/icons';
import { Flex } from 'antd';

interface Props {
  report: WCLReport;
}

export default function ViewAddReportTableCellDelete({ report }: Props) {
  const dispatch = useAppDispatch();
  return (
    <Flex
      justify="center"
      align="center"
      onClick={() => {
        dispatch(removeReportWithFight(report.code));
      }}
      className="cursor-pointer select-none"
    >
      <DeleteOutlined style={{ fontSize: 18, color: '#f5222d' }} />
    </Flex>
  );
}
