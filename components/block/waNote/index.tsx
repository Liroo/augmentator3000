import { selectAnalysisTableWithExcludedAndPriority } from 'flux/analysis/selector';
import { useAppSelector } from 'flux/hooks';

export default function WaNote() {
  const analysisTable = useAppSelector(
    selectAnalysisTableWithExcludedAndPriority,
  );

  return (
    <div>
      <h1>WaNote</h1>
    </div>
  );
}
