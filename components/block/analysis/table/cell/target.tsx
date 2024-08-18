import { Select, Typography } from 'antd';
import { setPriorityCharacters } from 'flux/analysis/reducer';
import { selectAnalysisPriorityByKey } from 'flux/analysis/selector';
import { AnalysisTableRow } from 'flux/analysis/types';
import { useAppDispatch, useAppSelector } from 'flux/hooks';
import { selectPlanEncounterForm } from 'flux/plan/selector';
import { selectRosterInUseListWithWCLCharacter } from 'flux/roster/selector';
import {
  selectWCLCharacterByCharacterKey,
  selectWCLRegion,
} from 'flux/wcl/selector';
import { getClassById } from 'game/classes';
import { useEffect } from 'react';
import { analysisSetupToKey, rosterCharacterToKey } from 'utils/key';

const RenderCharacterName = ({ value }: { value: string }) => {
  const WCLCharacter = useAppSelector(selectWCLCharacterByCharacterKey(value));

  if (value === '') return <span>default</span>;
  if (!WCLCharacter) return null;
  const classColor = getClassById(WCLCharacter?.classID as number);

  return (
    <span className={`classID-${classColor?.id}`}>{WCLCharacter?.name}</span>
  );
};

type Props = {
  row: AnalysisTableRow;
  rowIndex: number;
  index: number;
  disabled?: boolean;
};

export default function AnalysisTableCellTimeTarget({
  row,
  rowIndex,
  index,
  disabled = false,
}: Props) {
  const entry = row.entries[index];
  const dispatch = useAppDispatch();

  const WCLCharacter = useAppSelector(
    selectWCLCharacterByCharacterKey(entry?.characterKey),
  );
  const roster = useAppSelector(selectRosterInUseListWithWCLCharacter);

  // for priority
  const encounterForm = useAppSelector(selectPlanEncounterForm);
  const WCLRegion = useAppSelector(selectWCLRegion);
  const key = analysisSetupToKey(
    WCLRegion,
    encounterForm.encounterId,
    encounterForm.difficulty,
    rowIndex,
  );
  const priority = useAppSelector(selectAnalysisPriorityByKey(key));

  // reset priority if there is no entry because this is likely a bug OR the user has deleted previous entry and try to fuck with me
  // What are you trying to do with my website???!!??!!
  useEffect(() => {
    if (!entry && priority[index] !== '') {
      dispatch(
        setPriorityCharacters({
          key,
          characters: new Array(6).fill(''),
        }),
      );
    }
  }, [entry, priority]);

  return (
    <div className="flex items-center justify-start">
      <Select
        disabled={disabled}
        allowClear
        style={{
          width: '100%',
        }}
        variant="borderless"
        value={entry?.priority ? entry?.characterKey : ''}
        options={[
          { value: '', label: 'default' },
          ...roster.map(({ rosterCharacter }) => ({
            value: rosterCharacterToKey(rosterCharacter),
            label: rosterCharacter.name,
          })),
        ]}
        onChange={(value) => {
          const newPriority = priority.map((p, i) => {
            if (p === value) return '';
            return i === index ? value : p;
          });
          dispatch(
            setPriorityCharacters({
              key,
              characters: newPriority,
            }),
          );
        }}
        optionRender={(props) => (
          <RenderCharacterName value={props.value as string} />
        )}
        labelRender={({ value }) => {
          if (value === '') {
            if (!entry) return null;
            return (
              <Typography.Text>
                {new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(entry.average)}{' '}
                -{' '}
                <span
                  className={`classID-${getClassById(WCLCharacter?.classID as number)?.id}`}
                >
                  {WCLCharacter?.name}
                </span>
              </Typography.Text>
            );
          } else return <RenderCharacterName value={value as string} />;
        }}
      />
    </div>
  );
}
