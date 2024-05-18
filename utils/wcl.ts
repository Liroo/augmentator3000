import { WowClassSpec } from '@/wow/class';
import { WowRealms } from '@/wow/realm';

export const playerDetailsServerToServer = (playerDetailsServer: string) => {
  const server = Object.values(WowRealms)
    .reduce((acc, cur) => {
      return [...acc, ...cur];
    })
    .find((realm) => {
      if (playerDetailsServer.includes(realm.name.replace(' ', ''))) {
        return realm.slug;
      }
    });

  return server;
};

export const playerDetailsClassToClassId = (playerDetailsClass: string) => {
  return Object.values(WowClassSpec).find(
    (wowClass) => wowClass.name.replace(' ', '') === playerDetailsClass,
  )?.id;
};

export const characterToInternalId = (character: {
  name: string;
  serverSlug: string;
}) => {
  return `${character.name}-${character.serverSlug}`;
};
