'use client';
import { Typography } from 'antd';
import ViewEditRosterForm from './form';
import ViewEditRosterTable from './table';

export default function ViewEditRoster() {
  return (
    <section>
      <Typography.Title level={5}>🧑‍🤝‍🧑 Edit Roster</Typography.Title>

      <ViewEditRosterForm />
      <div className="mt-[16px]">
        <ViewEditRosterTable />
      </div>
    </section>
  );
}
