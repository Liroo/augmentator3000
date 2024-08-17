import {
  WCLCharacter,
  WCLCharacterEncounterRanking,
  WCLReport,
  WCLReportFight,
} from 'services/wcl/types';
import { rosterCharacterToKey } from './roster';

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
