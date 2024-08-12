import { REALMS } from './REALMS';

interface RealmList {
  [region: string]: Realm[];
}

interface Realm {
  name: string;
  slug: string;
}

export const REALM_LIST: RealmList = REALMS;
