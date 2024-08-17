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

export type WCLCharacterEncounterRanking = {
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

export type WCLCharacter = {
  id: string;
  classID: number;
  name: string;
  encounterRankings?: {
    [key: string]: WCLCharacterEncounterRanking;
  };
} & WCLCharacterQueryWithSpec;

export type WCLCharacterEncounterRankingsQuery = {
  encounterID: number;
  difficulty: number;
  partition?: number;
};

export type WCLReportQuery = {
  code: string;
  startTime: number;
  timeRanges: Array<{ startTime: number; endTime: number }>;
};

export type WCLReportTableEntry = {
  internalId: string;
  name: string;
  id: number;
  guid: number;
  total: number;
};

export type WCLReportFight = {
  id: number;
  friendlyPlayers: string[];
  bossPercentage: number;
  difficulty: number;
  encounterID: number;
  startTime: number;
  endTime: number;
  fightPercentage: number;
  kill: boolean;
  name: string;
  phaseTransitions: Array<{
    id: number;
    startTime: number;
  }>;
};

export type WCLReportPlayerDetailsSpec = {
  count: number;
  spec: string;
};

export type WCLReportPlayerDetails = {
  id: string;
  name: string;
  server: string;
  serverSlug: string;
  specs: WCLReportPlayerDetailsSpec[];
  type: string;
};

export type WCLReport = {
  title: string;
  code: string;
  region: string;

  associatedEncounterID?: number;
  playerDetails?: WCLReportPlayerDetails[];
  startTime?: number;
  tables?: {
    [tableKey: string]: {
      startTime: number;
      endTime: number;
      entries: WCLReportTableEntry[];
    };
  };

  fights?: WCLReportFight[];
};
