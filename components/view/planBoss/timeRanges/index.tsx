import UITimeRangesSlider from '@/components/ui/timeRangesSlider';
import { useAppDispatch, useAppSelector } from '@/flux/hooks';
import { PlanStateTimeRange, setTimeRangesByKey } from '@/flux/plan/reducer';
import {
  selectPlanEncounterForm,
  selectPlanTimeRangesByKey,
} from '@/flux/plan/selector';
import ViewPlanBossTimeRangesForm from './form';

export default function ViewPlanBossTimeRanges() {
  const { timeRangesKey } = useAppSelector(selectPlanEncounterForm);
  const timeRanges = useAppSelector(selectPlanTimeRangesByKey(timeRangesKey));
  const dispatch = useAppDispatch();

  return (
    <>
      <ViewPlanBossTimeRangesForm />
      <div className="mt-[16px]">
        <UITimeRangesSlider
          disabled={timeRangesKey.startsWith('default-')}
          timeRanges={timeRanges}
          setTimeRanges={(newTimeRanges: PlanStateTimeRange[]) => {
            dispatch(
              setTimeRangesByKey({
                key: timeRangesKey,
                timeRanges: newTimeRanges,
              }),
            );
          }}
        />
      </div>
    </>
  );
}
