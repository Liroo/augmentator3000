import { Table, TableColumnsType } from 'antd';
import { useAppSelector } from 'flux/hooks';
import { selectRosterListWithWCLCharacter } from 'flux/roster/selector';
import { RosterCharacter } from 'flux/roster/types';
import { WCLCharacter } from 'wcl/types';
import RosterTableCellClass from './cell/class';
import RosterTableCellDelete from './cell/delete';
import RosterTableCellName from './cell/name';
import RosterTableCellSpec from './cell/spec';
import RosterTableCellSpecIcon from './cell/specIcon';
import RosterTableCellState from './cell/state';
import RosterTableCellUse from './cell/use';

const columns: TableColumnsType<{
  rosterCharacter: RosterCharacter;
  WCLCharacter: WCLCharacter | undefined;
}> = [
  {
    title: '',
    key: 'state',
    render: ({ rosterCharacter, WCLCharacter }) => (
      <RosterTableCellState
        WCLCharacter={WCLCharacter}
        rosterCharacter={rosterCharacter}
      />
    ),
    width: 50,
  },
  {
    title: 'Use',
    key: 'use',
    render: ({ rosterCharacter }) => (
      <RosterTableCellUse rosterCharacter={rosterCharacter} />
    ),
    width: 50,
  },
  {
    title: 'Name',
    key: 'name',
    render: ({ rosterCharacter, WCLCharacter }) => (
      <RosterTableCellName
        rosterCharacter={rosterCharacter}
        WCLCharacter={WCLCharacter}
      />
    ),
    width: 200,
  },
  {
    title: '',
    key: 'specIcon',
    render: ({ rosterCharacter, WCLCharacter }) => (
      <RosterTableCellSpecIcon
        rosterCharacter={rosterCharacter}
        WCLCharacter={WCLCharacter}
      />
    ),
    width: 40,
  },
  {
    title: 'Class',
    key: 'class',
    render: ({ WCLCharacter }) => (
      <RosterTableCellClass WCLCharacter={WCLCharacter} />
    ),
    width: 150,
  },
  {
    title: 'Spec',
    key: 'spec',
    render: ({ rosterCharacter, WCLCharacter }) => (
      <RosterTableCellSpec
        rosterCharacter={rosterCharacter}
        WCLCharacter={WCLCharacter}
      />
    ),
  },
  // { title: 'Server', dataIndex: 'serverSlug', key: 'serverSlug', width: 150 },
  {
    title: '',
    key: 'delete',
    render: ({ rosterCharacter, WCLCharacter }) => (
      <RosterTableCellDelete rosterCharacter={rosterCharacter} />
    ),
    width: 50,
  },
];

export default function RosterTable() {
  const rosterListEnhanced = useAppSelector(selectRosterListWithWCLCharacter);

  return (
    <Table
      rowKey={({ rosterCharacter }) =>
        `${rosterCharacter.name}-${rosterCharacter.serverSlug}-${rosterCharacter.serverRegion}`
      }
      size="small"
      columns={columns}
      dataSource={rosterListEnhanced}
      pagination={false}
    />
  );
}
