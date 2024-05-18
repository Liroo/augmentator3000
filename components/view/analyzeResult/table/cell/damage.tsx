import { useAppDispatch, useAppSelector } from '@/flux/hooks';
import { setTimeRangesByKey } from '@/flux/plan/reducer';
import {
  selectPlanEncounterForm,
  selectPlanTimeRangesByKey,
} from '@/flux/plan/selector';
import { selectRosterListEnhanced } from '@/flux/roster/selector';
import { selectWCLCharacterByInternalId } from '@/flux/wcl/selector';
import { ResultEntry } from '@/types/result';
import { characterToInternalId } from '@/utils/wcl';
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
  const isDefault = !value;
  const character = useAppSelector(selectWCLCharacterByInternalId(value));
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
  value: string | null;
  entry: ResultEntry;
}) => {
  const isDefault = value === null;
  const character = useAppSelector(
    selectWCLCharacterByInternalId(
      isDefault && !!entry ? entry.internalId : (value as string),
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
    if (manualPriorities[i]) shiftIndex++;
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
            () => null,
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
        allowClear
        style={{ width: '100%' }}
        value={manualPriorities?.[index] || null}
        variant="borderless"
        labelRender={({ value }) => {
          return <LabelRender value={value as string | null} entry={entry} />;
        }}
        options={[
          {
            label: 'default',
            value: null,
          },
          ...rosterListEnhanced
            .filter(
              (character) =>
                !manualPriorities.includes(characterToInternalId(character)),
            )
            .map((character) => {
              return {
                label: character.name,
                value: characterToInternalId(character),
              };
            }),
        ]}
        optionRender={({ value }) => {
          return <OptionRender value={value as string} />;
        }}
        onChange={onChange}
        disabled={!canEdit}
        className={`${manualPriorities?.[index] ? 'rounded-[4px] border border-white border-opacity-30' : ''}`}
      />
    </Flex>
  );
}
