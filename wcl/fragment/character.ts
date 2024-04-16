import { gql } from 'graphql-request';

export const WCLFramgentCharacter = gql`
  fragment WCLFramgentCharacter on Character {
    canonicalID
    id
    classID
    name
  }
`;
