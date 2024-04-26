'use client';
import { Collapse } from 'antd';
import ViewEditRosterForm from './form';
import ViewEditRosterTable from './table';

export default function ViewEditRoster() {
  return (
    <section>
      <Collapse
        size="small"
        items={[
          {
            key: '1',
            label: '🧑‍🤝‍🧑 Edit Roster',
            children: (
              <>
                <ViewEditRosterForm />
                <div className="mt-[16px]">
                  <ViewEditRosterTable />
                </div>
              </>
            ),
          },
        ]}
      />
    </section>
  );
}
