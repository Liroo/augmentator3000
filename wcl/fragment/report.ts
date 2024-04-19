import { gql } from 'graphql-request';

export const WCLFramgentReport = gql`
  fragment WCLFramgentReport on Report {
    code
  }
`;
