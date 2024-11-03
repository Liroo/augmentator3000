import { RosterCharacter, RosterCharacterQuery } from 'flux/roster/types';
import {
  WCLCharacter,
  WCLCharacterEncounterRanking,
  WCLReport,
  WCLReportFight,
} from 'services/wcl/types';

export const encounterToKey = (encounterId: number, difficulty: number) => {
  return `${encounterId}_${difficulty}`;
};

export const getDataFromEncounterKey = (key: string) => {
  const [encounterId, difficulty] = key.split('_');
  return {
    encounterId: Number(encounterId),
    difficulty: Number(difficulty),
  };
};

export const rosterCharacterToKey = (
  player: RosterCharacter | RosterCharacterQuery,
) => {
  return `${player.name.toLowerCase()}_${player.serverSlug}_${player.serverRegion.toLowerCase()}`;
};

export const getDataFromRosterCharacterKey = (key: string) => {
  const [name, serverSlug, serverRegion] = key.split('_');
  return {
    name,
    serverSlug,
    serverRegion,
  };
};

export const reportFightToKey = (report: WCLReport, fight: WCLReportFight) => {
  return `${report.code}_${report.region}_${fight.encounterID}_${fight.difficulty}_${fight.id}`;
};

export const getDataFromReportFightKey = (key: string) => {
  const [reportCode, region, encounterID, difficulty, id] = key.split('_');
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
  return `${rosterCharacterToKey(character)}:${encounterId}:${difficulty}:${partition}:${rank.report.code}:${rank.report.fightID}`;
};

export const getDataFromEncouterRankingRankKey = (key: string) => {
  const [
    characterKey,
    encounterId,
    difficulty,
    partition,
    reportCode,
    fightId,
  ] = key.split(':');
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
) => `${region}_${encounterId}_${difficulty}_${index}`;

export const getDataFromAnalysisSetup = (key: string) => {
  const [region, encounterId, difficulty, index] = key.split('_');
  return {
    region,
    encounterId: Number(encounterId),
    difficulty: Number(difficulty),
    index: Number(index),
  };
};
