import { gql } from 'graphql-request';

export const WCLFramgentCharacter = gql`
  fragment WCLFramgentCharacter on Character {
    id
    classID
    name
  }
`;
