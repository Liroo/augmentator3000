import { DeleteOutlined } from '@ant-design/icons';
import { removeTimeRange } from 'flux/customEbonMight/reducer';
import { useAppDispatch, useAppSelector } from 'flux/hooks';
import { selectPlanEncounterForm } from 'flux/plan/selector';
import { encounterToKey } from 'utils/key';

type Props = {
  rowIndex: number;
};

export default function TimeRangeTableCellDelete({ rowIndex }: Props) {
  const dispatch = useAppDispatch();
  const encounterForm = useAppSelector(selectPlanEncounterForm);
  const key = encounterToKey(
    encounterForm.encounterId,
    encounterForm.difficulty,
  );

  return (
    <div
      className="flex cursor-pointer select-none items-center justify-center"
      onClick={() => {
        dispatch(removeTimeRange({ key, index: rowIndex }));
      }}
    >
      <DeleteOutlined style={{ fontSize: 18, color: '#f5222d' }} />
    </div>
  );
}
