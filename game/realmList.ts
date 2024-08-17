import { REALMS } from './realms';

interface RealmList {
  [region: string]: Realm[];
}

interface Realm {
  name: string;
  slug: string;
}

export const REALM_LIST: RealmList = REALMS;

export const findServerFromRegionAndName = (region: string, name: string) => {
  const regionData = REALM_LIST[region];
  if (!regionData) return null;

  return regionData.find(
    (server) => server.name.replaceAll(' ', '') === name.replaceAll(' ', ''),
  );
};
