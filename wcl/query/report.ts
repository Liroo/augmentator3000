import { WowRealms } from '@/wow/realm';
import { gql, GraphQLClient } from 'graphql-request';
import { WCLFramgentReport } from '../fragment/report';
import { WCLReport, WCLReportQuery } from '../wcl';

export const WCLGetReportTableDamage = async function (
  WCLClient: GraphQLClient,
  code: string,
  timeRanges: WCLReportQuery['timeRanges'],
  filterExpression?: string,
) {
  const globalTimeRange = timeRanges.reduce(
    (acc, cur) => {
      if (cur.startTime < acc.startTime) acc.startTime = cur.startTime;
      if (cur.endTime > acc.endTime) acc.endTime = cur.endTime;
      return acc;
    },
    { startTime: Infinity, endTime: -Infinity },
  );

  const query = gql`
    ${WCLFramgentReport}
    query WCLGetReportTableDamage {
      reportData {
        report(code: "${code}") {
          ...WCLFramgentReport
          playerDetails(
            killType: Encounters,
            startTime: ${globalTimeRange.startTime},
            endTime: ${globalTimeRange.endTime}
          )
          ${timeRanges.map((tr) => {
            return `table_${tr.startTime}_${tr.endTime}: table(
              startTime: ${tr.startTime},
              endTime: ${tr.endTime},
              dataType: DamageDone,
              filterExpression: "${filterExpression}"
            )`;
          })}
        } 
      }
    }
  `;

  const res = (await WCLClient.request(query)) as {
    reportData: {
      report: any;
    };
  };

  const serializedReport: WCLReport = {
    title: res.reportData.report.title,
    code: res.reportData.report.code,
    playerDetails:
      res.reportData.report.playerDetails.data.playerDetails.dps.map(
        (pd: any) => ({
          name: pd.name,
          id: pd.id,
          guid: pd.guid,
          server: pd.server,
        }),
      ),
    rankedCharacters: res.reportData.report.rankedCharacters.map((rc: any) => ({
      name: rc.name,
      serverSlug: rc.server.slug,
      canonicalID: rc.canonicalID,
    })),
  };

  Object.keys(res.reportData.report).forEach((key) => {
    if (key.startsWith('table_')) {
      const [startTime, endTime] = key.split('_').slice(1).map(Number);

      if (!serializedReport.tables) serializedReport.tables = {};
      serializedReport.tables[`${startTime}-${endTime}`] = {
        startTime,
        endTime,
        entries: res.reportData.report[key].data.entries
          .map((entry: any) => {
            const playerDetails =
              res.reportData.report.playerDetails.data.playerDetails.dps.find(
                (pd: any) => pd.guid === entry.guid,
              );
            if (!playerDetails) return null;

            let serverSlug = '';
            Object.values(WowRealms)
              .reduce((acc, cur) => {
                return [...acc, ...cur];
              }, [])
              .find((realm) => {
                if (
                  playerDetails.server.includes(realm.name.replace(' ', ''))
                ) {
                  serverSlug = realm.slug;
                  return true;
                }
                return false;
              });

            const rankedCharacter = res.reportData.report.rankedCharacters.find(
              (rc: any) =>
                rc.name === playerDetails.name && rc.server.slug === serverSlug,
            );

            return {
              name: entry.name,
              id: entry.id,
              guid: entry.guid,
              total: entry.total,
              canonicalID: rankedCharacter?.canonicalID,
            };
          })
          .filter((entry: any) => !!entry),
      };
    }
  });

  return serializedReport;
};

export const WCLGetReportWithFights = async function (
  WCLClient: GraphQLClient,
  code: string,
) {
  const query = gql`
    ${WCLFramgentReport}
    query WCLGetReportTableDamage {
      reportData {
        report(code: "${code}") {
          ...WCLFramgentReport
          fights {
            friendlyPlayers
            bossPercentage
            encounterID
            startTime
            endTime
            fightPercentage
            kill
            name
          }
          masterData(translate: true) {
            actors {
              id
              name
              server
              type
            }
          }
        } 
      }
    }
  `;

  const res = (await WCLClient.request(query)) as {
    reportData: {
      report: any;
    };
  };

  const serializedReport: WCLReport = {
    title: res.reportData.report.title,
    code: res.reportData.report.code,
    rankedCharacters: res.reportData.report.rankedCharacters.map((rc: any) => ({
      name: rc.name,
      serverSlug: rc.server.slug,
      canonicalID: rc.canonicalID,
    })),
  };

  serializedReport.fights = res.reportData.report.fights.map((fight: any) => {
    const friendlyCanocialIDs = fight.friendlyPlayers.map((fp: number) => {
      const actor = res.reportData.report.masterData.actors.find(
        (a: any) => a.id === fp,
      );
      if (!actor) return null;

      let serverSlug = '';
      Object.values(WowRealms)
        .reduce((acc, cur) => {
          return [...acc, ...cur];
        }, [])
        .find((realm) => {
          if (actor.server.includes(realm.name.replace(' ', ''))) {
            serverSlug = realm.slug;
            return true;
          }
          return false;
        });

      const rankedCharacter = res.reportData.report.rankedCharacters.find(
        (rc: any) => rc.name === actor.name && rc.server.slug === serverSlug,
      );
      return rankedCharacter?.canonicalID;
    });

    return { ...fight, friendlyPlayers: friendlyCanocialIDs };
  });

  return serializedReport;
};
