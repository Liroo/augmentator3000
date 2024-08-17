export type RosterCharacterQuery = {
  name: string;
  serverSlug: string;
  serverRegion: string;
};

export type RosterCharacter = {
  name: string;
  serverSlug: string;
  serverRegion: string;
  specId?: number;
  use: boolean;
};
