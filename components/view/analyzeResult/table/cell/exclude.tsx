import { useAppDispatch, useAppSelector } from '@/flux/hooks';
import { setTimeRangesByKey } from '@/flux/plan/reducer';
import {
  selectPlanEncounterForm,
  selectPlanTimeRangesByKey,
} from '@/flux/plan/selector';
import { selectRosterListEnhanced } from '@/flux/roster/selector';
import { selectWCLCharacterByCanonicalID } from '@/flux/wcl/selector';
import { getClassById, getClassColor } from '@/wow/class';
import { Select, Tag } from 'antd';

interface Props {
  startTime: number;
  endTime: number;
  excludeCanonicalIDs: number[];
}

const TagRender = ({
  value,
  closable,
  onClose,
}: {
  value: number;
  closable: boolean;
  onClose: any;
}) => {
  const character = useAppSelector(selectWCLCharacterByCanonicalID(value));
  const characterClass = character
    ? getClassById(character.classID)
    : undefined;
  const classColor = getClassColor(characterClass);

  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{
        marginInlineEnd: 4,
        marginBottom: 2,
        marginTop: 2,
        color: classColor,
      }}
    >
      {character?.name}
    </Tag>
  );
};

const OptionRender = ({ value }: { value: number }) => {
  const character = useAppSelector(selectWCLCharacterByCanonicalID(value));
  const characterClass = character
    ? getClassById(character.classID)
    : undefined;
  const classColor = getClassColor(characterClass);

  return (
    <span
      style={{
        color: classColor,
      }}
    >
      {character?.name}
    </span>
  );
};

export default function ViewAnalyzeResultTableCellExclude({
  startTime,
  endTime,
  excludeCanonicalIDs,
}: Props) {
  const rosterListEnhanced = useAppSelector(selectRosterListEnhanced);
  const { timeRangesKey } = useAppSelector(selectPlanEncounterForm);
  const timeRanges = useAppSelector(selectPlanTimeRangesByKey(timeRangesKey));
  const dispatch = useAppDispatch();

  const onChange = (values: number[]) => {
    const newTimeRanges = timeRanges.map((timeRange) => {
      if (timeRange.startTime === startTime && timeRange.endTime === endTime) {
        return {
          ...timeRange,
          excludeCanonicalIDs: values,
        };
      }

      return timeRange;
    });

    dispatch(
      setTimeRangesByKey({ key: timeRangesKey, timeRanges: newTimeRanges }),
    );
  };

  return (
    <Select
      mode="multiple"
      defaultValue={excludeCanonicalIDs}
      tagRender={(props) => <TagRender {...props} />}
      style={{ width: '100%' }}
      options={rosterListEnhanced.map((character) => ({
        label: character.canonicalID,
        value: character.canonicalID,
      }))}
      optionRender={(props) => <OptionRender value={props.value as number} />}
      onChange={onChange}
    />
  );
}