import { gql, GraphQLClient } from 'graphql-request';
import { WCLFramgentCharacter } from '../fragment/character';
import { WCLCharacter, WCLCharacterQuery } from '../wcl';

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

// Not typed yet, not used yet
export const WCLGetCharacters = async function (
  WCLClient: GraphQLClient,
  characters: Array<WCLCharacterQuery>,
) {
  const query = gql`
    ${WCLFramgentCharacter}
    query WCLGetCharacters {
      characterData {
        ${characters.map((character, index) => {
          return `character${index}: character(
            name: "${character.name}"
            serverSlug: "${character.serverSlug}"
            serverRegion: "${character.serverRegion}"
          ) {
            ...WCLFramgentCharacter
          }`;
        })}
      }
    }
  `;
  const res = await WCLClient.request(query);

  return res;
};
