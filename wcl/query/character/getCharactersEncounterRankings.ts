import { RosterCharacter } from '@/flux/roster/types';
import Specs from '@/game/specs';
import { encounterRankingToKey } from '@/utils/report';
import { rosterCharacterToKey } from '@/utils/roster';
import { WCLCharacterEncounterRanking } from '@/wcl/types';
import { gql, GraphQLClient } from 'graphql-request';

export const WCLGetCharactersEncounterRankings = async function (
  WCLClient: GraphQLClient,
  characters: RosterCharacter[],
  encounterId: number,
  difficulty: number,
  partitions: number[],
) {
  const encounterRankings =
    partitions.length > 0
      ? partitions.map((partition) => ({
          encounterId,
          difficulty,
          partition,
        }))
      : [{ encounterId, difficulty, partition: '' }];

  const query = gql`
    query WCLGetCharactersEncounterRankings {
      characterData {
        ${characters.map((rosterCharacter, index) => {
          const spec = Specs[rosterCharacter.specId || -1];

          return `character_${index}: character(
            name: "${rosterCharacter.name}"
            serverSlug: "${rosterCharacter.serverSlug}"
            serverRegion: "${rosterCharacter.serverRegion ?? 'EU'}"
          ) {
            ${encounterRankings.map((encounterRanking) => {
              return `encounterRanking_${encounterRanking.partition}: encounterRankings(
                encounterID: ${encounterRanking.encounterId},
                difficulty: ${encounterRanking.difficulty}
                ${spec ? `, specName: "${spec.wclSpecName}"` : ''},
                ${encounterRanking.partition ? `, partition: ${encounterRanking.partition}` : ''}
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

  const encounterRankingsByCharacter: Record<
    string,
    { [rosterCharacterKey: string]: WCLCharacterEncounterRanking }
  > = {};
  Object.values(res.characterData).forEach((characterData, index) => {
    const rosterCharacter = characters[index];
    const rosterCharacterKey = rosterCharacterToKey(rosterCharacter);
    encounterRankingsByCharacter[rosterCharacterKey] = {};

    Object.entries(characterData).forEach(([key, value]) => {
      const [_, partition = '0'] = key.split('_');

      encounterRankingsByCharacter[rosterCharacterKey][
        encounterRankingToKey(encounterId, difficulty, partition)
      ] = value as WCLCharacterEncounterRanking;
    });
  });

  return encounterRankingsByCharacter as Record<
    string,
    { [rosterCharacterKey: string]: WCLCharacterEncounterRanking }
  >;
};
