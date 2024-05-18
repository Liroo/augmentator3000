import ViewAddReports from '@/components/view/addReports';
import ViewAnalyzeResult from '@/components/view/analyzeResult';
import ViewEditRoster from '@/components/view/editRoster';
import ViewNote from '@/components/view/note';
import ViewPlanBoss from '@/components/view/planBoss';
import { Card } from 'antd';

export default function Home() {
  return (
    <main className="mx-[20px] my-[16px] mb-[200px]">
      <Card className="!mb-[16px]">
        What I would like to add:
        <br />
        <br />- Manual priorities by boss (or add list of manual priorities)
      </Card>

      <ViewEditRoster />
      <ViewAddReports />
      <ViewPlanBoss />
      <ViewAnalyzeResult />

      <ViewNote />
    </main>
  );
}
