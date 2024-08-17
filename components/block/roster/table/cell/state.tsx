import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Flex, Spin, Tooltip } from 'antd';
import { useAppSelector } from 'flux/hooks';
import { RosterCharacter } from 'flux/roster/types';
import { StatusEnum } from 'flux/status/reducer';
import { selectStatusByActionTypeId } from 'flux/status/selector';
import { getWCLCharacter } from 'flux/wcl/action';
import { rosterCharacterToKey } from 'utils/roster';
import { WCLCharacter } from 'wcl/types';

interface Props {
  rosterCharacter: RosterCharacter;
  WCLCharacter: WCLCharacter;
}

export default function RosterTableCellState({
  rosterCharacter,
  WCLCharacter,
}: Props) {
  const { status } = useAppSelector(
    selectStatusByActionTypeId(
      getWCLCharacter.typePrefix,
      rosterCharacterToKey(rosterCharacter),
    ),
  );

  let icon = null;
  if (WCLCharacter?.classID) {
    icon = (
      <Tooltip title="Character has been fetch">
        <CheckCircleOutlined style={{ fontSize: 18, color: '#52c41a' }} />
      </Tooltip>
    );
  } else if ([StatusEnum.Idle, StatusEnum.Pending].includes(status)) {
    icon = (
      <Tooltip title="Fetching...">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} />
      </Tooltip>
    );
  } else {
    icon = (
      <Tooltip title="Character not found. Maybe they changed name or server. This character will still be used in analysis.">
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
