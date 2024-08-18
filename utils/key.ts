import { RosterCharacter, RosterCharacterQuery } from 'flux/roster/types';
import {
  WCLCharacter,
  WCLCharacterEncounterRanking,
  WCLReport,
  WCLReportFight,
} from 'services/wcl/types';

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

export const reportFightToKey = (report: WCLReport, fight: WCLReportFight) => {
  return `${report.code}-${report.region}-${fight.encounterID}-${fight.difficulty}-${fight.id}`;
};

export const getDataFromReportFightKey = (key: string) => {
  const [reportCode, region, encounterID, difficulty, id] = key.split('-');
  return {
    reportCode,
    region,
    encounterId: Number(encounterID),
    difficulty: Number(difficulty),
    fightId: Number(id),
  };
};

export const encounterRankingRankToKey = (
  character: WCLCharacter,
  encounterId: number,
  difficulty: number,
  partition: number,
  rank: WCLCharacterEncounterRanking['ranks'][0],
) => {
  return `${rosterCharacterToKey(character)}_${encounterId}_${difficulty}_${partition}_${rank.report.code}_${rank.report.fightID}`;
};

export const getDataFromEncouterRankingRankKey = (key: string) => {
  const [
    characterKey,
    encounterId,
    difficulty,
    partition,
    reportCode,
    fightId,
  ] = key.split('_');
  return {
    characterKey,
    encounterId: Number(encounterId),
    difficulty: Number(difficulty),
    partition: Number(partition),
    reportCode,
    fightId: Number(fightId),
  };
};

export const encounterRankingToKey = (
  encounterId: number,
  difficulty: number,
  partition: string,
) => {
  return `${encounterId}_${difficulty}_${partition}`;
};

export const getDataFromEncouterRankingKey = (key: string) => {
  const [encounterId, difficulty, partition] = key.split('_');
  return {
    encounterId: Number(encounterId),
    difficulty: Number(difficulty),
    partition,
  };
};

export const analysisSetupToKey = (
  region: string,
  encounterId: number,
  difficulty: number,
  index: number,
) => `${region}-${encounterId}-${difficulty}-${index}`;

export const getDataFromAnalysisSetup = (key: string) => {
  const [region, encounterId, difficulty, index] = key.split('-');
  return {
    region,
    encounterId: Number(encounterId),
    difficulty: Number(difficulty),
    index: Number(index),
  };
};
