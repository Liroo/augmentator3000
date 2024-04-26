'use client';
import { Card, Collapse } from 'antd';
import ViewAddReportsForm from './form';
import ViewAddReportsTable from './table';

export default function ViewAddReports() {
  return (
    <section className="mt-[32px]">
      <Collapse
        size="small"
        items={[
          {
            key: '1',
            label: '📊 Add Report',
            children: (
              <>
                <Card size="small">
                  That part is optional. You can add wlogs report url and select
                  pull by pull. Note that only characters from your roster will
                  be analyzed.
                </Card>

                <div className="mt-[16px]">
                  <ViewAddReportsForm />
                </div>

                <div className="mt-[16px]">
                  <ViewAddReportsTable />
                </div>
              </>
            ),
          },
        ]}
      />
    </section>
  );
}
