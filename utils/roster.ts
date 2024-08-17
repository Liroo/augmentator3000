import { RosterCharacter, RosterCharacterQuery } from '@/flux/roster/types';

export const rosterCharacterToKey = (
  player: RosterCharacter | RosterCharacterQuery,
) => {
  return `${player.name.toLowerCase()}-${player.serverSlug}-${player.serverRegion.toLowerCase()}`;
};

export const getDataFromRosterCharacterKey = (key: string) => {
  const [name, serverSlug, serverRegion] = key.split('-');
  return {
    name,
    serverSlug,
    serverRegion,
  };
};
