import { useAppDispatch } from '@/flux/hooks';
import { rosterRemoveCharacter } from '@/flux/roster/reducer';
import { WCLCharacter } from '@/wcl/wcl';
import { DeleteOutlined } from '@ant-design/icons';
import { Flex } from 'antd';

interface Props {
  character: WCLCharacter;
}

export default function ViewEditRosterTableCellDelete({ character }: Props) {
  const dispatch = useAppDispatch();
  return (
    <Flex
      justify="center"
      align="center"
      onClick={() => {
        dispatch(rosterRemoveCharacter(character));
      }}
      className="cursor-pointer"
    >
      <DeleteOutlined style={{ fontSize: 18, color: '#f5222d' }} />
    </Flex>
  );
}
