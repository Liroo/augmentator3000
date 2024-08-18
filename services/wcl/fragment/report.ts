import { gql } from 'graphql-request';

export const WCLFramgentReport = gql`
  fragment WCLFramgentReport on Report {
    title
    code
    region {
      slug
    }
  }
`;

export const WCLFramgentReportFight = gql`
  fragment WCLFramgentReportFight on ReportFight {
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
`;
