import { InputNumber, InputNumberProps, Typography } from 'antd';
import { setMinimumFightDurationMinutes } from 'flux/analysis/reducer';
import { selectAnalysisMinimumFightDurationMinutes } from 'flux/analysis/selector';
import { useAppDispatch, useAppSelector } from 'flux/hooks';
import AnalysisFormExcluded from './excluded';

export default function AnalysisForm() {
  const dispatch = useAppDispatch();
  const minimumFightDurationMinutes = useAppSelector(
    selectAnalysisMinimumFightDurationMinutes,
  );

  const onChangeMinimumFightDurationMinutes: InputNumberProps['onChange'] = (
    value,
  ) => {
    dispatch(setMinimumFightDurationMinutes(value as number));
  };

  return (
    <div className="flex justify-between">
      <div className="flex items-end gap-[8px]">
        <InputNumber
          size="small"
          value={minimumFightDurationMinutes}
          min={1}
          max={20}
          step={1}
          onChange={onChangeMinimumFightDurationMinutes}
        />
        <Typography.Text>Minimum Fight Duration (in minutes)</Typography.Text>
      </div>
      <div className="flex items-end gap-[8px]">
        <Typography.Text>Used for bulk update</Typography.Text>
        <AnalysisFormExcluded />
      </div>
    </div>
  );
}
