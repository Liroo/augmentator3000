import { findServerFromRegionAndName } from 'game/realmList';
import { gql, GraphQLClient } from 'graphql-request';
import { WCLFramgentReport } from 'services/wcl/fragment/report';
import { WCLReportPlayerDetails } from 'services/wcl/types';

export const WCLGetReportWithFights = async function (
  WCLClient: GraphQLClient,
  code: string,
) {
  const fightsQuery = gql`
      ${WCLFramgentReport}
      query WCLGetReportWithFights {
      reportData {
        report(code: "${code}") {
          ...WCLFramgentReport
          code
          region {
            slug
          }
          fights {
            id
            difficulty
            friendlyPlayers
            bossPercentage
            encounterID
            startTime
            endTime
            fightPercentage
            kill
            name
            phaseTransitions {
              id
              startTime
            }
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
    (f: any) => f.encounterID !== 0 && f.fightPercentage,
  );

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
  };
};
