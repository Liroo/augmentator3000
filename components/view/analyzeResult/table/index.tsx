import { useAppSelector } from '@/flux/hooks';
import { selectPlanEncounterForm } from '@/flux/plan/selector';
import { selectRosterListEnhanced } from '@/flux/roster/selector';
import { StatusEnum } from '@/flux/status/reducer';
import { selectStatusByActionTypeId } from '@/flux/status/selector';
import { getWCLReports } from '@/flux/wcl/action';
import { selectWCLReports } from '@/flux/wcl/selector';
import { ResultEntry } from '@/types/result';
import { WCLCharacter } from '@/wcl/wcl';
import { WowRealms } from '@/wow/realm';
import { WowRegion } from '@/wow/region';
import { Table, TableColumnsType } from 'antd';
import { useMemo } from 'react';
import ViewAnalyzeResultTableCellDamage from './cell/damage';
import ViewAnalyzeResultTableCellTimer from './cell/timer';

const columns: TableColumnsType<ResultEntry> = [
  {
    title: 'Time Range',
    key: 'timeRange',
    render: (_, __, index) => (
      <ViewAnalyzeResultTableCellTimer timeRangesIndex={index} />
    ),
    width: 120,
    fixed: 'left',
  },
  {
    title: 'Best target',
    key: 'entry0',
    render: (entries) => (
      <ViewAnalyzeResultTableCellDamage entry={entries[0]} />
    ),
    width: 150,
  },
  {
    title: '2nd best target',
    key: 'entry1',
    render: (entries) => (
      <ViewAnalyzeResultTableCellDamage entry={entries[1]} />
    ),
    width: 150,
  },
  {
    title: '3rd best target',
    key: 'entry2',
    render: (entries) => (
      <ViewAnalyzeResultTableCellDamage entry={entries[2]} />
    ),
    width: 150,
  },
  {
    title: '4th best target',
    key: 'entry3',
    render: (entries) => (
      <ViewAnalyzeResultTableCellDamage entry={entries[3]} />
    ),
    width: 150,
  },

  {
    title: '5th best target',
    key: 'entry4',
    render: (entries) => (
      <ViewAnalyzeResultTableCellDamage entry={entries[4]} />
    ),
    width: 150,
  },

  {
    title: '6th best target',
    key: 'entry5',
    render: (entries) => (
      <ViewAnalyzeResultTableCellDamage entry={entries[5]} />
    ),
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
      const addRankToAcc = (rank: any) => {
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
      };
      const rank0 = c?.encounterRankings?.[encounterID]?.ranks?.[0];
      const rank1 = c?.encounterRankings?.[encounterID]?.ranks?.[1];
      const rank2 = c?.encounterRankings?.[encounterID]?.ranks?.[2];

      if (rank0) addRankToAcc(rank0);
      if (rank1) addRankToAcc(rank1);
      if (rank2) addRankToAcc(rank2);

      return acc;
    }, []);

    let table: any = [];

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

    table = table.map((t: ResultEntry[]) => {
      const nameServerSlugMap = new Map<
        string,
        { total: number; count: number }
      >();
      t.forEach((e) => {
        const key = `${e.name}-${e.serverSlug}`;
        if (!nameServerSlugMap.has(key)) {
          nameServerSlugMap.set(key, { total: e.total, count: 1 });
        } else {
          const { total, count } = nameServerSlugMap.get(key)!;
          nameServerSlugMap.set(key, {
            total: total + e.total,
            count: count + 1,
          });
        }
      });

      t = [];
      nameServerSlugMap.forEach((value, key) => {
        const [name, serverSlug] = key.split('-');
        t.push({ name, serverSlug, total: value.total / value.count });
      });

      return t;
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
