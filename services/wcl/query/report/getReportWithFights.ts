import { findServerFromRegionAndName } from 'game/realmList';
import { gql, GraphQLClient } from 'graphql-request';
import {
  WCLFramgentReport,
  WCLFramgentReportFight,
} from 'services/wcl/fragment/report';
import { WCLReport, WCLReportPlayerDetails } from 'services/wcl/types';

export const WCLGetReportWithFights = async function (
  WCLClient: GraphQLClient,
  code: string,
) {
  const fightsQuery = gql`
      ${WCLFramgentReport}
      ${WCLFramgentReportFight}
      query WCLGetReportWithFights {
      reportData {
        report(code: "${code}") {
          ...WCLFramgentReport
          fights {
            ...WCLFramgentReportFight
          }
          playerDetails(startTime: 0, endTime: 2147483647) # 0 to max int
        }
      }
    }
  `;
  const fightsRes = (await WCLClient.request(fightsQuery)) as {
    reportData: {
      report: any;
    };
  };

  const region = fightsRes.reportData.report.region.slug;
  let fights = fightsRes.reportData.report.fights.filter(
    (f: any) => f.encounterID !== 0 && typeof f.fightPercentage === 'number',
  );

  console.log(fights, fightsRes);

  return {
    ...fightsRes.reportData.report,
    fights,
    region,
    playerDetails:
      fightsRes.reportData.report.playerDetails.data.playerDetails.dps.map(
        (dps: WCLReportPlayerDetails) => {
          const serverSlug = findServerFromRegionAndName(
            region,
            dps.server,
          )?.slug;

          return {
            ...dps,
            serverSlug,
          };
        },
      ),
  } as WCLReport;
};
