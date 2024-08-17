import { Table, TableColumnsType } from 'antd';
import { useAppSelector } from 'flux/hooks';
import { selectRosterInUseListWithWCLCharacter } from 'flux/roster/selector';
import { RosterCharacter } from 'flux/roster/types';
import { WCLCharacter } from 'wcl/types';
import LogsSelectBestLogsTableCellName from './cell/name';
import LogsSelectBestLogsTableCellRankings from './cell/rankings';
import LogsSelectBestLogsTableCellSpecIcon from './cell/specIcon';

const columns: TableColumnsType<{
  rosterCharacter: RosterCharacter;
  WCLCharacter: WCLCharacter | undefined;
}> = [
  {
    title: '',
    key: 'specIcon',
    render: ({ rosterCharacter, WCLCharacter }) => (
      <LogsSelectBestLogsTableCellSpecIcon
        rosterCharacter={rosterCharacter}
        WCLCharacter={WCLCharacter}
      />
    ),
    width: 40,
  },
  {
    title: 'Name',
    key: 'name',
    render: ({ rosterCharacter, WCLCharacter }) => (
      <LogsSelectBestLogsTableCellName
        rosterCharacter={rosterCharacter}
        WCLCharacter={WCLCharacter}
      />
    ),
    width: 200,
  },
  {
    title: 'Rankings',
    key: 'rankings',
    render: ({ WCLCharacter }) => (
      <LogsSelectBestLogsTableCellRankings WCLCharacter={WCLCharacter} />
    ),
  },
];

export default function LogsSelectBestLogsTable() {
  const rosterListEnhanced = useAppSelector(
    selectRosterInUseListWithWCLCharacter,
  );

  return (
    <Table
      tableLayout="fixed"
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
