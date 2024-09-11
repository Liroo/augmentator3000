import { findServerFromRegionAndName } from 'game/realmList';
import { gql, GraphQLClient } from 'graphql-request';
import {
  WCLFramgentReport,
  WCLFramgentReportFight,
} from 'services/wcl/fragment/report';
import { WCLReport, WCLReportPlayerDetails } from 'services/wcl/types';
import { TimeRange } from 'utils/analysis';

export const WCLGetReportDamageTable = async function (
  WCLClient: GraphQLClient,
  code: string,
  fightId: number,
  timeRanges: TimeRange[],
  filterExpression: string,
) {
  const reportDamageTableQuery = gql`
      ${WCLFramgentReport}
      ${WCLFramgentReportFight}
      query WCLGetReportWithFights {
      reportData {
        report(code: "${code}") {
          ...WCLFramgentReport
          fights(fightIDs: [${fightId}]) {
            ...WCLFramgentReportFight
          }
          ${timeRanges.map((tr) => {
            return `table_${tr.startTime}_${tr.endTime}: table(
              fightIDs: [${fightId}],
              startTime: ${tr.startTime},
              endTime: ${tr.endTime},
              dataType: DamageDone,
              filterExpression: "${filterExpression}"
            )`;
          })}
          playerDetails(
            killType: Encounters,
            startTime: ${timeRanges[0].startTime},
            endTime: ${timeRanges[timeRanges.length - 1].endTime}
          )
        }
      }
    }
  `;
  const reportDamageTableRes = (await WCLClient.request(
    reportDamageTableQuery,
  )) as {
    reportData: {
      report: any;
    };
  };

  const region = reportDamageTableRes.reportData.report.region.slug;
  const playerDetails = [
    ...reportDamageTableRes.reportData.report.playerDetails.data.playerDetails
      .dps,
    ...reportDamageTableRes.reportData.report.playerDetails.data.playerDetails
      .healers,
    ...reportDamageTableRes.reportData.report.playerDetails.data.playerDetails
      .tanks,
  ].map((dps: WCLReportPlayerDetails) => {
    const serverSlug = findServerFromRegionAndName(region, dps.server)?.slug;

    return {
      ...dps,
      serverSlug,
    };
  });

  const tables = Object.entries(reportDamageTableRes.reportData.report)
    .filter(([key]) => key.startsWith('table_'))
    .map(([key, value]) => {
      const [_, startTime, endTime] = key.split('_');
      const entries = (value as any).data.entries
        .map((entry: any) => {
          const player = playerDetails.find(
            (p) => p.id === entry.id,
          ) as WCLReportPlayerDetails;

          if (!player) return null;
          return {
            name: player.name,
            serverSlug: player.serverSlug,
            serverRegion: region,
            id: entry.id,
            total: entry.total,
          };
        })
        .filter((e: any) => !!e);

      return {
        startTime: ~~startTime,
        endTime: ~~endTime,
        entries,
      };
    });

  return {
    title: reportDamageTableRes.reportData.report.title,
    code: reportDamageTableRes.reportData.report.code,
    fights: reportDamageTableRes.reportData.report.fights,
    region,
    playerDetails,
    tables,
  } as WCLReport;
};
