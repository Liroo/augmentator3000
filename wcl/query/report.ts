import { gql, GraphQLClient } from 'graphql-request';
import { WCLFramgentReport } from '../fragment/report';
import { WCLReport } from '../wcl';

// Not typed yet, not used yet
export const WCLGetReportTableDamage = async function (
  WCLClient: GraphQLClient,
  code: string,
  timeRanges: Array<{ startTime: number; endTime: number }>,
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
  };

  Object.keys(res.reportData.report).forEach((key) => {
    if (key.startsWith('table_')) {
      const [startTime, endTime] = key.split('_').slice(1).map(Number);

      if (!serializedReport.tables) serializedReport.tables = {};
      serializedReport.tables[`${startTime}-${endTime}`] = {
        startTime,
        endTime,
        entries: res.reportData.report[key].data.entries.map((entry: any) => ({
          name: entry.name,
          id: entry.id,
          guid: entry.guid,
          total: entry.total,
        })),
      };
    }
  });

  return serializedReport;
};
