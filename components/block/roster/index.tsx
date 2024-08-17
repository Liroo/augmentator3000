import { Collapse } from 'antd';
import { useAppSelector } from 'flux/hooks';
import { selectRosterListCount } from 'flux/roster/selector';
import RosterForm from './form';
import RosterTable from './table';

export default function Roster() {
  const { total, inUse } = useAppSelector(selectRosterListCount);

  return (
    <Collapse
      size="small"
      items={[
        {
          key: '1',
          label: `🧑‍🤝‍🧑 Edit Roster (${inUse}/${total} players in use)`,
          children: (
            <>
              <RosterForm />
              <div className="mt-[12px]">
                <RosterTable />
              </div>
            </>
          ),
        },
      ]}
    />
  );
}
