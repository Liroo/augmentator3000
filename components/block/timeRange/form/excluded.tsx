import { Select, SelectProps, Tag } from 'antd';
import { setExcludedBulkCharacters } from 'flux/customEbonMight/reducer';
import { selectCustomEbonMightExcludedBulk } from 'flux/customEbonMight/selector';
import { useAppDispatch, useAppSelector } from 'flux/hooks';
import { selectRosterInUseListWithWCLCharacter } from 'flux/roster/selector';
import { selectWCLCharacterByCharacterKey } from 'flux/wcl/selector';
import { getClassById } from 'game/classes';
import { rosterCharacterToKey } from 'utils/key';

const TagRender: SelectProps['tagRender'] = ({ value, closable, onClose }) => {
  const WCLCharacter = useAppSelector(selectWCLCharacterByCharacterKey(value));
  const classColor = getClassById(WCLCharacter?.classID as number);

  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={value}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{
        marginInlineEnd: 4,
        marginBottom: 2,
        marginTop: 2,
        lineHeight: '17px',
        height: '20px',
      }}
      className={`classID-${classColor?.id}`}
    >
      {WCLCharacter?.name}
    </Tag>
  );
};

const OptionRender = ({ value }: { value: string }) => {
  const WCLCharacter = useAppSelector(selectWCLCharacterByCharacterKey(value));
  const classColor = getClassById(WCLCharacter?.classID as number);

  return (
    <span className={`classID-${classColor?.id}`}>{WCLCharacter?.name}</span>
  );
};

export default function TimeRangeFormFormExcluded() {
  const roster = useAppSelector(selectRosterInUseListWithWCLCharacter);
  const excluded = useAppSelector(selectCustomEbonMightExcludedBulk);

  const dispatch = useAppDispatch();
  const onChange = (values: string[]) => {
    dispatch(setExcludedBulkCharacters(values));
  };

  return (
    <div className="flex items-center justify-start">
      <Select
        allowClear
        size="small"
        mode="tags"
        style={{ width: '300px' }}
        value={excluded}
        options={roster.map(({ rosterCharacter }) => ({
          label: rosterCharacterToKey(rosterCharacter),
          value: rosterCharacterToKey(rosterCharacter),
        }))}
        onChange={onChange}
        tagRender={TagRender}
        optionRender={(props) => <OptionRender value={props.value as string} />}
      />
    </div>
  );
}
