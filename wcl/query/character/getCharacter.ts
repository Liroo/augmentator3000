import { gql, GraphQLClient } from 'graphql-request';
import { WCLFramgentCharacter } from 'wcl/fragment/character';
import { WCLCharacter, WCLCharacterQuery } from 'wcl/types';

export const WCLGetCharacter = async function (
  WCLClient: GraphQLClient,
  characterQuery: WCLCharacterQuery,
) {
  const query = gql`
    ${WCLFramgentCharacter}
    query WCLGetCharacter(
      $name: String!
      $serverSlug: String!
      $serverRegion: String!
    ) {
      characterData {
        character(
          name: $name
          serverSlug: $serverSlug
          serverRegion: $serverRegion
        ) {
          ...WCLFramgentCharacter
        }
      }
    }
  `;

  const res = (await WCLClient.request(query, characterQuery)) as {
    characterData: {
      character: WCLCharacter;
    };
  };

  return res.characterData.character;
};
