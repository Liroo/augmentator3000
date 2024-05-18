'use client';
import { useAppDispatch } from '@/flux/hooks';
import { resetReports } from '@/flux/wcl/reducer';
import { Button, Popconfirm, Typography } from 'antd';
import ViewAnalyzeRosterTable from './table';

export default function ViewAnalyzeResult() {
  const dispatch = useAppDispatch();

  const resetStore = () => {
    localStorage.removeItem('persist:auganalyzer-root');
    window.location.reload();
  };

  return (
    <section className="mt-[32px]">
      <Typography.Title level={5}>🧘🏼 Results</Typography.Title>

      <ViewAnalyzeRosterTable />

      <div className="mt-[16px]">
        <Popconfirm
          title="Delete the results"
          description="Are you sure to reset reports?"
          onConfirm={() => {
            dispatch(resetReports());
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Reset results</Button>
        </Popconfirm>

        <Popconfirm
          title="Reset website"
          description="Are you sure to reset the website?"
          onConfirm={() => {
            resetStore();
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button className="ml-[8px]" danger>
            Reset everything
          </Button>
        </Popconfirm>
      </div>
    </section>
  );
}
