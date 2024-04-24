import ViewAddReports from '@/components/view/addReports';
import ViewAnalyzeResult from '@/components/view/analyzeResult';
import ViewEditRoster from '@/components/view/editRoster';
import ViewSelectBoss from '@/components/view/planBoss';
import { Card } from 'antd';

export default function Home() {
  return (
    <main className="mx-[20px] my-[16px] mb-[200px]">
      <Card className="!mb-[16px]">
        What I would like to add:
        <br />
        <br />- Use logs url list instead of best rank
      </Card>

      <ViewEditRoster />
      <ViewAddReports />
      <ViewSelectBoss />
      <ViewAnalyzeResult />
    </main>
  );
}
