import { ImportOutlined } from '@ant-design/icons';
import { Select, SelectProps, Tag, Tooltip } from 'antd';
import { AnalysisTableRow } from 'flux/analysis/types';
import { setExcludedCharacters } from 'flux/customEbonMight/reducer';
import {
  selectCustomEbonMightExcludedBulk,
  selectCustomEbonMightExcludedByKey,
} from 'flux/customEbonMight/selector';
import { useAppDispatch, useAppSelector } from 'flux/hooks';
import { selectPlanEncounterForm } from 'flux/plan/selector';
import { selectRosterInUseListWithWCLCharacter } from 'flux/roster/selector';
import {
  selectWCLCharacterByCharacterKey,
  selectWCLRegion,
} from 'flux/wcl/selector';
import { getClassById } from 'game/classes';
import { analysisSetupToKey, rosterCharacterToKey } from 'utils/key';

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

type Props = {
  row: AnalysisTableRow;
  rowIndex: number;
};

export default function TimeRangeTableCellTimeExcluded({ rowIndex }: Props) {
  const roster = useAppSelector(selectRosterInUseListWithWCLCharacter);
  const region = useAppSelector(selectWCLRegion);
  const encounterForm = useAppSelector(selectPlanEncounterForm);
  const key = analysisSetupToKey(
    region,
    encounterForm.encounterId,
    encounterForm.difficulty,
    rowIndex,
  );
  const excluded = useAppSelector(selectCustomEbonMightExcludedByKey(key));

  const dispatch = useAppDispatch();
  const onChange = (values: string[]) => {
    dispatch(setExcludedCharacters({ key, characters: values }));
  };

  const excludedBulk = useAppSelector(selectCustomEbonMightExcludedBulk);
  const onClickUseBulk = () => {
    dispatch(setExcludedCharacters({ key, characters: excludedBulk }));
  };

  return (
    <div className=" flex items-center justify-start gap-[8px]">
      <Select
        allowClear
        mode="tags"
        style={{ width: '100%' }}
        value={excluded}
        options={roster.map(({ rosterCharacter }) => ({
          label: rosterCharacterToKey(rosterCharacter),
          value: rosterCharacterToKey(rosterCharacter),
        }))}
        onChange={onChange}
        tagRender={TagRender}
        optionRender={(props) => <OptionRender value={props.value as string} />}
      />
      <Tooltip title="Use bulk update">
        <div className="cursor-pointer select-none" onClick={onClickUseBulk}>
          <ImportOutlined />
        </div>
      </Tooltip>
    </div>
  );
}
