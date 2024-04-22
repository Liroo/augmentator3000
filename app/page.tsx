import ViewAnalyzeResult from '@/components/view/analyzeResult';
import ViewEditRoster from '@/components/view/editRoster';
import ViewSelectBoss from '@/components/view/planBoss';
import { Card } from 'antd';

export default function Home() {
  return (
    <main className="mx-[20px] my-[16px]">
      <Card className="!mb-[16px]">
        What I would like to add:
        <br />
        <br />
        - Default time ranges per boss
        <br />
        - Editable time ranges (can save them)
        <br />
        - Editable table
        <br />
        - Obv can export note
        <br />
        - Improve form with number of log to analyze
        <br />- Use log url instead of best rank
      </Card>

      <ViewEditRoster />
      <ViewSelectBoss />
      <ViewAnalyzeResult />
    </main>
  );
}
