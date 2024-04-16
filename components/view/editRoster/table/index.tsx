import { useAppSelector } from '@/flux/hooks';
import { selectRosterListEnhanced } from '@/flux/roster/selector';
import { WCLCharacter } from '@/wcl/wcl';
import { Table, TableColumnsType } from 'antd';
import ViewEditRosterTableCellClass from './cell/class';
import ViewEditRosterTableCellDelete from './cell/delete';
import ViewEditRosterTableCellName from './cell/name';
import ViewEditRosterTableCellSpec from './cell/spec';
import ViewEditRosterTableCellSpecIcon from './cell/specIcon';
import ViewEditRosterTableCellState from './cell/state';

const columns: TableColumnsType<WCLCharacter> = [
  {
    title: '',
    key: 'state',
    render: (character) => (
      <ViewEditRosterTableCellState character={character} />
    ),
    width: 50,
  },
  {
    title: 'Name',
    key: 'name',
    render: (character) => (
      <ViewEditRosterTableCellName character={character} />
    ),
    width: 200,
  },
  {
    title: '',
    key: 'specIcon',
    render: (character) => (
      <ViewEditRosterTableCellSpecIcon character={character} />
    ),
    width: 40,
  },
  {
    title: 'Class',
    key: 'class',
    render: (character) => (
      <ViewEditRosterTableCellClass character={character} />
    ),
    width: 150,
  },
  {
    title: 'Spec',
    key: 'spec',
    render: (character) => (
      <ViewEditRosterTableCellSpec character={character} />
    ),
  },
  { title: 'Server', dataIndex: 'serverSlug', key: 'serverSlug', width: 150 },
  {
    title: '',
    key: 'delete',
    render: (character) => (
      <ViewEditRosterTableCellDelete character={character} />
    ),
    width: 50,
  },
];

export default function ViewEditRosterTable() {
  const rosterListEnhanced = useAppSelector(selectRosterListEnhanced);

  return (
    <Table
      rowKey={(record) =>
        `${record.name}-${record.serverSlug}-${record.serverRegion}`
      }
      columns={columns}
      dataSource={rosterListEnhanced}
      pagination={false}
    />
  );
}
