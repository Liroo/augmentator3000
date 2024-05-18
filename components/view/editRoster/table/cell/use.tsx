import { useAppDispatch } from '@/flux/hooks';
import { setCharacter } from '@/flux/wcl/reducer';
import { WCLCharacter } from '@/wcl/wcl';
import { Checkbox } from 'antd';

interface Props {
  character: WCLCharacter;
}

export default function ViewEditRosterTableCellUse({ character }: Props) {
  const dispatch = useAppDispatch();

  const onClickCheckbox = () => {
    dispatch(
      setCharacter({
        ...character,
        use: !character.use,
      }),
    );
  };

  return (
    <div className="flex justify-center">
      <Checkbox checked={character.use} onClick={onClickCheckbox} />
    </div>
  );
}
