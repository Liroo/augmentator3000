import RosterForm from '@/components/block/rosterForm';
import CoreLogEventScreen from '@/components/core/logEventScreen';
import ViewAddReports from '@/components/view/addReports';
import ViewAnalyzeResult from '@/components/view/analyzeResult';
import ViewEditRoster from '@/components/view/editRoster';
import ViewNote from '@/components/view/note';
import ViewPlanBoss from '@/components/view/planBoss';

export default async function Home({
  searchParams,
}: {
  searchParams: {
    error: string;
  };
}) {
  return (
    <main className="my-[16px]">
      <RosterForm />

      <ViewEditRoster />
      <ViewAddReports />
      <ViewPlanBoss />
      <ViewAnalyzeResult />

      <ViewNote />

      <CoreLogEventScreen location="home" />
    </main>
  );
}
