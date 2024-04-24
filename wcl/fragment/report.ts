import { gql } from 'graphql-request';

export const WCLFramgentReport = gql`
  fragment WCLFramgentReport on Report {
    title
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
