import {
  characterToInternalId,
  playerDetailsServerToServer,
} from '@/utils/wcl';
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

  const playerDetails = [
    ...res.reportData.report.playerDetails.data.playerDetails.dps,
    ...res.reportData.report.playerDetails.data.playerDetails.healers,
    ...res.reportData.report.playerDetails.data.playerDetails.tanks,
  ].map((pd: any) => {
    return {
      ...pd,
      serverSlug: playerDetailsServerToServer(pd.server)?.slug,
    };
  });

  const serializedReport: WCLReport = {
    title: res.reportData.report.title,
    code: res.reportData.report.code,
    playerDetails,
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
            const pd = playerDetails.find((pd: any) => pd.guid === entry.guid);
            if (!pd) return null;

            return {
              internalId: characterToInternalId({
                name: entry.name,
                serverSlug: pd.serverSlug,
              }),
              name: entry.name,
              serverSlug: pd.serverSlug,
              id: entry.id,
              guid: entry.guid,
              total: entry.total,
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
  const fightsQuery = gql`
    query WCLGetReportTableDamage {
      reportData {
        report(code: "${code}") {
          fights {
            id
            friendlyPlayers
            bossPercentage
            encounterID
            startTime
            endTime
            fightPercentage
            kill
            name
          }
        }
      }
    }
  `;
  const fightsRes = (await WCLClient.request(fightsQuery)) as {
    reportData: {
      report: any;
    };
  };
  let fights = fightsRes.reportData.report.fights.filter(
    (f: any) => f.encounterID !== 0 && f.fightPercentage,
  );
  const fightIDs = fights.map((f: any) => f.id);

  const reportQuery = gql`
  ${WCLFramgentReport}
  query WCLGetReportTableDamage {
    reportData {
      report(code: "${code}") {
        ...WCLFramgentReport
        playerDetails(
          fightIDs: ${JSON.stringify(fightIDs)}
        )
      }
    }
  }
`;

  const reportRes = (await WCLClient.request(reportQuery)) as {
    reportData: {
      report: any;
    };
  };

  const playerDetails = [
    ...reportRes.reportData.report.playerDetails.data.playerDetails.dps,
    ...reportRes.reportData.report.playerDetails.data.playerDetails.healers,
    ...reportRes.reportData.report.playerDetails.data.playerDetails.tanks,
  ].map((pd: any) => {
    return {
      ...pd,
      serverSlug: playerDetailsServerToServer(pd.server)?.slug,
    };
  });

  fights = fights.map((f: any) => {
    f.friendlyPlayers = f.friendlyPlayers.map((fp: number) => {
      const player = playerDetails.find((pd: any) => pd.id === fp);
      return characterToInternalId(player as any);
    });
    return f;
  });

  const serializedReport: WCLReport = {
    title: reportRes.reportData.report.title,
    code: reportRes.reportData.report.code,
    playerDetails,
    fights,
  };

  return serializedReport;
};
