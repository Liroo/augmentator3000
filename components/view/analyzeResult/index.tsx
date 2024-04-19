'use client';
import { Typography } from 'antd';
import ViewAnalyzeRosterTable from './table';

export default function ViewAnalyzeResult() {
  return (
    <section className="mt-[32px]">
      <Typography.Title level={5}>🧘🏼 Analyze Result</Typography.Title>

      <ViewAnalyzeRosterTable />
    </section>
  );
}
