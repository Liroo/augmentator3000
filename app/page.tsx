import AuthSignIn from '@/components/auth/signIn';
import AuthSignOut from '@/components/auth/signOut';
import ViewAddReports from '@/components/view/addReports';
import ViewAnalyzeResult from '@/components/view/analyzeResult';
import ViewEditRoster from '@/components/view/editRoster';
import ViewNote from '@/components/view/note';
import ViewPlanBoss from '@/components/view/planBoss';
import { Alert, Card } from 'antd';
import { authOptions } from 'app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export default async function Home({
  searchParams,
}: {
  searchParams: {
    error: string;
  };
}) {
  const session = await getServerSession(authOptions);

  if (!session)
    return (
      <main className="flex h-full flex-col items-center justify-center">
        <div className="mb-[16px]">
          <AuthSignIn />
        </div>
        {searchParams.error && (
          <Alert message={searchParams.error} type="error" />
        )}
      </main>
    );

  return (
    <main className="mx-[20px] my-[16px] mb-[200px]">
      <Card className="!mb-[16px]">
        <a href="https://github.com/Liroo/auganalyzer" target="_blank">
          https://github.com/Liroo/auganalyzer
        </a>
      </Card>

      <ViewEditRoster />
      <ViewAddReports />
      <ViewPlanBoss />
      <ViewAnalyzeResult />

      <ViewNote />

      <AuthSignOut />
    </main>
  );
}
