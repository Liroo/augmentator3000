/*
  Those are types and attributes from GraphQL sometimes modified
  they may be incomplete and types can be found here:
  https://www.warcraftlogs.com/v2-api-docs/warcraft/
*/

export type WCLCharacterQuery = {
  name: string;
  serverSlug: string;
  serverRegion: string;
};

export interface WCLCharacterQueryWithSpec extends WCLCharacterQuery {
  specID?: number;
}

export type WCLCharacter = {
  canonicalID: string;
  id: string;
  classID: number;
  name: string;
} & WCLCharacterQueryWithSpec;
