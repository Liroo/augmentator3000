import { gql, GraphQLClient } from 'graphql-request';
import { WCLFramgentCharacter } from '../fragment/character';
import {
  WCLCharacter,
  WCLCharacterEncounterRankingsQuery,
  WCLCharacterQuery,
  WCLCharacterQueryWithSpec,
} from '../wcl';

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

export const WCLGetCharacters = async function (
  WCLClient: GraphQLClient,
  characters: Array<WCLCharacterQueryWithSpec>,
  encounterRankings: Array<WCLCharacterEncounterRankingsQuery>,
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

            ${encounterRankings.map((encounterRanking) => {
              return `encounterRanking_${encounterRanking.encounterID}: encounterRankings(
                encounterID: ${encounterRanking.encounterID},
                difficulty: ${encounterRanking.difficulty},
                specName: "${character.specName}"
              )`;
            })}
          }`;
        })}
      }
    }
  `;
  const res = (await WCLClient.request(query)) as {
    characterData: {
      [characterIndex: string]: any;
    };
  };

  // for each character, transform keys encounterRanking-<encounterID> to an object of encounterRankings hashed by encounterID
  Object.keys(res.characterData).forEach((characterIndex, index) => {
    const character = res.characterData[characterIndex];
    const encounterRankings = Object.keys(character).reduce(
      (acc, key) => {
        if (key.startsWith('encounterRanking_')) {
          const encounterID = parseInt(key.split('_')[1]);
          acc[encounterID] = character[key];
        }
        return acc;
      },
      {} as Record<number, any>,
    );

    character.serverSlug = characters[index].serverSlug;
    character.serverRegion = characters[index].serverRegion;
    character.encounterRankings = encounterRankings;
  });

  return res.characterData as Record<string, WCLCharacter>;
};
