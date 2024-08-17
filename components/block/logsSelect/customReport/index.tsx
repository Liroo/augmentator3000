import { Checkbox } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useAppDispatch, useAppSelector } from 'flux/hooks';
import { setFilterCustomReportByEncouterId } from 'flux/plan/reducer';
import { selectPlanFilterCustomReportByEncouterId } from 'flux/plan/selector';
import LogsSelectCustomReportForm from './form';
import LogsSelectCustomReportTable from './table';

export default function LogsSelectCustomReport() {
  const dispatch = useAppDispatch();
  const filterCustomReportByEncouterId = useAppSelector(
    selectPlanFilterCustomReportByEncouterId,
  );

  const onClickFilterCustomReportByEncounterId = (e: CheckboxChangeEvent) => {
    dispatch(setFilterCustomReportByEncouterId(e.target.checked));
  };

  return (
    <>
      <LogsSelectCustomReportForm />
      <div className="mt-[12px] select-none">
        <Checkbox
          defaultChecked={filterCustomReportByEncouterId}
          onChange={onClickFilterCustomReportByEncounterId}
        >
          Filter by current encounter
        </Checkbox>
      </div>
      <div className="mt-[12px]">
        <LogsSelectCustomReportTable />
      </div>
    </>
  );
}
