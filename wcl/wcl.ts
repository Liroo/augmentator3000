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

export type WCLCharacterQueryWithSpec = {
  specID?: number;
  specName?: string;
} & WCLCharacterQuery;

export type WCLCharacter = {
  canonicalID: string;
  id: string;
  classID: number;
  name: string;
  encounterRankings?: {
    [encounterID: string]: {
      averagePerformance: number;
      bestAmount: number;
      difficulty: number;
      fastestKill: number;
      medianPerformance: number;
      metric: string;
      partition: number;
      ranks: Array<{
        lockedIn: boolean;
        rankPercent: number;
        historicalPercent: number;
        todayPercent: number;
        rankTotalParses: number;
        historicalTotalParses: number;
        todayTotalParses: number;
        guild: {
          id: number;
          name: string;
          faction: number;
        };
        report: {
          code: string;
          startTime: number;
          fightID: number;
        };
        duration: number;
        startTime: number;
        amount: number;
        bracketData: number;
        spec: string;
        bestSpec: string;
        class: number;
        faction: number;
      }>;
      totalKills: number;
      zone: number;
    };
  };
} & WCLCharacterQueryWithSpec;

export type WCLCharacterEncounterRankingsQuery = {
  encounterID: number;
  difficulty: number;
};
