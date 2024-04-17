import ViewAnalyzeResult from '@/components/view/analyzeResult';
import ViewEditRoster from '@/components/view/editRoster';
import ViewSelectBoss from '@/components/view/selectBoss';

export default function Home() {
  return (
    <main className="mx-[20px] my-[16px]">
      <ViewEditRoster />
      <ViewSelectBoss />
      <ViewAnalyzeResult />
    </main>
  );
}
