import { useAppDispatch, useAppSelector } from '@/flux/hooks';
import { setTimeRangesByKey } from '@/flux/plan/reducer';
import {
  selectPlanEncounterForm,
  selectPlanTimeRangesByKey,
} from '@/flux/plan/selector';
import { selectRosterListEnhanced } from '@/flux/roster/selector';
import { selectWCLCharacterByCanonicalID } from '@/flux/wcl/selector';
import { ResultEntry } from '@/types/result';
import { getClassById, getClassColor } from '@/wow/class';
import { Flex, Select } from 'antd';

interface Props {
  startTime: number;
  endTime: number;
  entries: ResultEntry[];
  index: number;
  canEdit?: boolean;
  manualPriorities: string[];
}

const OptionRender = ({ value }: { value: string }) => {
  const isDefault = value === 'default';
  const character = useAppSelector(
    selectWCLCharacterByCanonicalID(parseInt(value)),
  );
  const characterClass = character
    ? getClassById(character.classID)
    : undefined;
  const classColor = getClassColor(characterClass);

  return (
    <p className="truncate">
      <span
        style={{
          color: classColor,
        }}
      >
        {isDefault ? 'default' : character?.name || '-'}
      </span>
    </p>
  );
};

const LabelRender = ({
  value,
  entry,
}: {
  value: string;
  entry: ResultEntry;
}) => {
  const isDefault = value === 'default';
  const character = useAppSelector(
    selectWCLCharacterByCanonicalID(
      isDefault && !!entry ? entry.canonicalID : parseInt(value),
    ),
  );
  const characterClass = character
    ? getClassById(character.classID)
    : undefined;
  const classColor = getClassColor(characterClass);

  return (
    <p className="truncate">
      <span
        style={{
          color: classColor,
        }}
      >
        {character?.name || '-'}
      </span>
      {isDefault && !!entry && (
        <>
          {' '}
          -{' '}
          {new Intl.NumberFormat('en-US', {
            notation: 'compact',
            compactDisplay: 'short',
          }).format(entry.total)}
        </>
      )}
    </p>
  );
};

export default function ViewAnalyzeResultTableCellDamage({
  startTime,
  endTime,
  entries,
  index,
  canEdit = true,
  manualPriorities,
}: Props) {
  let shiftIndex = 0;
  for (let i = 0; i < index; i++) {
    if (manualPriorities[i] !== 'default') shiftIndex++;
  }
  const entry = entries[index - shiftIndex];
  const rosterListEnhanced = useAppSelector(selectRosterListEnhanced);
  const { timeRangesKey } = useAppSelector(selectPlanEncounterForm);
  const timeRanges = useAppSelector(selectPlanTimeRangesByKey(timeRangesKey));
  const dispatch = useAppDispatch();

  const onChange = (value: string) => {
    const newTimeRanges = timeRanges.map((timeRange) => {
      if (timeRange.startTime === startTime && timeRange.endTime === endTime) {
        const newTimeRange = {
          ...timeRange,
          manualPriorities: [...(timeRange.manualPriorities || [])],
        };

        if (newTimeRange.manualPriorities.length < 6)
          newTimeRange.manualPriorities = Array.from({ length: 6 }).map(
            () => 'default',
          );
        newTimeRange.manualPriorities[index] = value;
        return newTimeRange;
      }

      return timeRange;
    });

    dispatch(
      setTimeRangesByKey({ key: timeRangesKey, timeRanges: newTimeRanges }),
    );
  };

  return (
    <Flex justify="start" align="center" className="mr-[8px]">
      <Select
        style={{ width: '100%' }}
        value={manualPriorities?.[index] || 'default'}
        variant="borderless"
        labelRender={({ value }) => {
          return <LabelRender value={value as string} entry={entry} />;
        }}
        options={[
          {
            label: 'default',
            value: 'default',
          },
          ...rosterListEnhanced
            .filter(
              ({ canonicalID }) =>
                !manualPriorities.includes(canonicalID?.toString?.()),
            )
            .map((roster) => {
              return {
                label: roster.name,
                value: roster.canonicalID?.toString?.(),
              };
            }),
        ]}
        optionRender={({ value }) => {
          return <OptionRender value={value as string} />;
        }}
        onChange={onChange}
        disabled={!canEdit}
      />
    </Flex>
  );
}
