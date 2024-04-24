'use client';
import { useAppDispatch } from '@/flux/hooks';
import { resetReports } from '@/flux/wcl/reducer';
import { Button, Popconfirm, Typography } from 'antd';
import ViewAnalyzeRosterTable from './table';

export default function ViewAnalyzeResult() {
  const dispatch = useAppDispatch();

  return (
    <section className="mt-[32px]">
      <Typography.Title level={5}>🧘🏼 Analyze Result</Typography.Title>

      <ViewAnalyzeRosterTable />

      <div className="mt-[16px]">
        <Popconfirm
          title="Delete the task"
          description="Are you sure to reset reports?"
          onConfirm={() => {
            dispatch(resetReports());
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Reset results</Button>
        </Popconfirm>
      </div>
    </section>
  );
}
