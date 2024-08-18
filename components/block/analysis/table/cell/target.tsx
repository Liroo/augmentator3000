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
};

export default function AnalysisTableCellTimeTarget({
  row,
  rowIndex,
  index,
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

  if (!WCLCharacter) return null;

  const characterClass = getClassById(WCLCharacter?.classID);

  return (
    <div className="flex items-center justify-start">
      <Select
        allowClear
        style={{
          width: '100%',
        }}
        variant="borderless"
        value={entry.priority ? entry.characterKey : ''}
        options={[
          { value: '', label: 'default' },
          ...roster.map(({ rosterCharacter }) => ({
            value: rosterCharacterToKey(rosterCharacter),
            label: rosterCharacter.name,
          })),
        ]}
        onChange={(value) => {
          dispatch(
            setPriorityCharacters({
              key,
              characters: priority.map((p, i) => (i === index ? value : p)),
            }),
          );
        }}
        optionRender={(props) => (
          <RenderCharacterName value={props.value as string} />
        )}
        labelRender={({ value }) => {
          if (value === '')
            return (
              <Typography.Text>
                {new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  compactDisplay: 'short',
                }).format(entry.average)}{' '}
                -{' '}
                <span className={`classID-${characterClass?.id}`}>
                  {WCLCharacter.name}
                </span>
              </Typography.Text>
            );
          else return <RenderCharacterName value={value as string} />;
        }}
      />
    </div>
  );
}
