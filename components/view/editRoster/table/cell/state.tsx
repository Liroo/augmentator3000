import { useAppSelector } from '@/flux/hooks';
import { StatusEnum } from '@/flux/status/reducer';
import { selectStatusByActionTypeId } from '@/flux/status/selector';
import { getWCLCharacter } from '@/flux/wcl/action';
import { WCLCharacter } from '@/wcl/wcl';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Flex, Spin, Tooltip } from 'antd';

interface Props {
  character: WCLCharacter;
}

export default function ViewEditRosterTableCellState({ character }: Props) {
  const { status } = useAppSelector(
    selectStatusByActionTypeId(
      getWCLCharacter.typePrefix,
      `${character.name}-${character.serverSlug}-${character.serverRegion}`,
    ),
  );

  let icon = null;
  if ([StatusEnum.Idle, StatusEnum.Pending].includes(status)) {
    icon = (
      <Tooltip title="Fetching...">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} />
      </Tooltip>
    );
  } else if (status === StatusEnum.Fulfilled && character.canonicalID) {
    icon = (
      <Tooltip title="Character has been fetch">
        <CheckCircleOutlined style={{ fontSize: 18, color: '#52c41a' }} />
      </Tooltip>
    );
  } else {
    icon = (
      <Tooltip title="Character not found">
        <CloseCircleOutlined style={{ fontSize: 18, color: '#f5222d' }} />{' '}
      </Tooltip>
    );
  }

  return (
    <Flex justify="center" align="center">
      {icon}
    </Flex>
  );
}
