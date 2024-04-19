import { useAppSelector } from '@/flux/hooks';
import { selectPlanEncounterForm } from '@/flux/plan/selector';
import { selectRosterListEnhanced } from '@/flux/roster/selector';
import { StatusEnum } from '@/flux/status/reducer';
import { selectStatusByActionTypeId } from '@/flux/status/selector';
import { getWCLReports } from '@/flux/wcl/action';
import { selectWCLReports } from '@/flux/wcl/selector';
import { WCLCharacter } from '@/wcl/wcl';
import { WowRealms } from '@/wow/realm';
import { WowRegion } from '@/wow/region';
import { Table, TableColumnsType } from 'antd';
import { useMemo } from 'react';

type Entries = {
  name: string;
  serverSlug: string;
  total: number;
};

const timeRanges: number[][] = [];
for (let i = 3000; i < 900000; i += 15000) {
  timeRanges.push([i, Math.min(i + 15000, 900000)]);
}

const columns: TableColumnsType<Entries> = [
  {
    title: 'Time Range',
    key: 'timeRange',
    render: (_, __, index) => (
      <p>
        {/* convert ms to mm:ss */}
        {new Date(timeRanges[index][0]).toISOString().substr(14, 5)} -{' '}
        {new Date(timeRanges[index][1]).toISOString().substr(14, 5)}
      </p>
    ),
    width: 100,
  },
  {
    title: 'Best target',
    key: 'entry0',
    render: (entries) => (
      <p>
        {entries[0]?.name} - {entries[0]?.total}
      </p>
    ),
    width: 100,
  },
  {
    title: '2nd best target',
    key: 'entry1',
    render: (entries) => (
      <p>
        {entries[1]?.name} - {entries[1]?.total}
      </p>
    ),
    width: 100,
  },
  {
    title: '3rd best target',
    key: 'entry2',
    render: (entries) => (
      <p>
        {entries[2]?.name} - {entries[2]?.total}
      </p>
    ),
    width: 100,
  },
  {
    title: '4th best target',
    key: 'entry3',
    render: (entries) => (
      <p>
        {entries[3]?.name} - {entries[3]?.total}
      </p>
    ),
    width: 100,
  },

  {
    title: '5th best target',
    key: 'entry4',
    render: (entries) => (
      <p>
        {entries[4]?.name} - {entries[4]?.total}
      </p>
    ),
    width: 100,
  },

  {
    title: '6th best target',
    key: 'entry5',
    render: (entries) => (
      <p>
        {entries[5]?.name} - {entries[5]?.total}
      </p>
    ),
    width: 100,
  },
];

export default function ViewAnalyzeRosterTable() {
  const rosterListEnhanced = useAppSelector(selectRosterListEnhanced);
  const wclReports = useAppSelector(selectWCLReports);
  const { encounterID } = useAppSelector(selectPlanEncounterForm);

  const { status } = useAppSelector(
    selectStatusByActionTypeId(getWCLReports.typePrefix),
  );

  const dataSource = useMemo(() => {
    if (status !== StatusEnum.Fulfilled) return [];

    const reportsToAnalyze: Array<{
      code: string;
      startTime: number;
      endTime: number;
      players: Array<{
        name: string;
        serverSlug: string;
        serverRegion: string;
      }>;
    }> = rosterListEnhanced.reduce((acc: any, c: WCLCharacter) => {
      const rank = c?.encounterRankings?.[encounterID]?.ranks?.[0];

      if (!rank) return acc;

      const existingRank = acc.find((r: any) => r.code === rank.report.code);
      if (existingRank) {
        existingRank.players.push({
          name: c.name,
          serverSlug: c.serverSlug,
          serverRegion: c.serverRegion,
        });
        return acc;
      }

      acc.push({
        code: rank.report.code,
        startTime: rank.startTime - rank.report.startTime,
        endTime: rank.startTime - rank.report.startTime + rank.duration,
        players: [
          {
            name: c.name,
            serverSlug: c.serverSlug,
            serverRegion: c.serverRegion,
          },
        ],
      });
      return acc;
    }, []);

    const table: any = [];

    reportsToAnalyze.forEach((rta) => {
      const report = wclReports[rta.code];
      if (!report) return;

      const playersGuidInReport = rta.players
        .map((p) => {
          const serverName = WowRealms[p.serverRegion as WowRegion].find(
            (realm) => realm.slug === p.serverSlug,
          )?.name;
          const player = report.playerDetails.find(
            (pd) => pd.name === p.name && pd.server === serverName,
          );

          return player?.guid;
        })
        .filter((guid) => !!guid);

      Object.values(report.tables || {})
        .sort((a, b) => a.startTime - b.startTime)
        .forEach((t, tIndex) => {
          t.entries.forEach((e) => {
            if (playersGuidInReport.includes(e.guid)) {
              if (!table[tIndex]) table[tIndex] = [];
              const serverSlug = rta.players.find(
                (p) => p.name === e.name,
              )?.serverSlug;
              table[tIndex].push({
                name: e.name,
                serverSlug,
                total: e.total,
              });
            }
          });
        });
    });

    table.forEach((t: any[]) => {
      t.sort((a, b) => b.total - a.total);
    });

    return table;
  }, [status]);

  return (
    <Table
      rowKey={(_, index) => `${index}`}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
    />
  );
}
