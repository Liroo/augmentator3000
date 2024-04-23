import { gql } from 'graphql-request';

export const WCLFramgentReport = gql`
  fragment WCLFramgentReport on Report {
    rankedCharacters {
      name
      server {
        slug
      }
      canonicalID
    }
    code
  }
`;
