import { Collapse, Divider, Typography } from 'antd';
import TimeRangeForm from './form';
import TimeRangeTable from './table';

export default function TimeRange() {
  return (
    <Collapse
      size="small"
      items={[
        {
          key: '1',
          label: `⌚️ Custom Ebon Might?`,
          children: (
            <>
              <Typography.Text>
                By default the targets are dynamically computed based on your
                Ebon Might CD. Meaning that the table below is only as a visual
                reference. If you need to delay your Ebon Might for any reason,
                you can specify some timers here.
                <br />
                <br />
                <strong>⚠️ Warning:</strong> By design of the whole system, the
                ebon might timers can be set only on specific timers. (in
                general 6s interval but can auto-adjust itself)
              </Typography.Text>
              <Divider />
              <TimeRangeForm />

              <TimeRangeTable />
            </>
          ),
        },
      ]}
    />
  );
}
