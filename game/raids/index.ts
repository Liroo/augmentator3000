import Aberrus from 'game/raids/aberrus';
import Amirdrassil from 'game/raids/amirdrassil';
import VaultOfTheIncarnates from 'game/raids/vaultoftheincarnates';
import { StaticImageData } from 'next/image';

export default interface PhaseConfig {
  name: string;
  key: string;
  difficulties: number[];
  multiple?: boolean;
  instance?: number;
  intermission?: boolean;
}

interface EncounterConfig {
  vantusRuneBuffId?: number;
  softMitigationChecks?: {
    physical: [];
    magical: [];
  };
  resultsWarning?: string;
  phases?: { [key: string]: PhaseConfig };
  disableDeathSuggestion?: boolean;
  disableDowntimeSuggestion?: boolean;
  disableDowntimeStatistic?: boolean;
}

interface Encounter {
  id: number;
  name: string;
  background?: StaticImageData;
  backgroundPosition?: string;
  headshot?: StaticImageData;
  icon?: string;
}

export interface Boss extends Encounter {
  fight: EncounterConfig;
}

export interface Raid {
  name: string;
  background?: StaticImageData;
  bosses: Record<string, Boss>;
}
export interface Phase extends PhaseConfig {
  start: number[];
  end: number[];
}

const raids = {
  VaultOfTheIncarnates, // tier 29
  Aberrus, // tier 30
  Amirdrassil, // tier 31
};

function findByRaidBossId(id: number) {
  return Object.values(raids)
    .flatMap((raid) => Object.values(raid.bosses))
    .find((boss) => boss.id === id);
}

export function findByBossId(id: number) {
  return findByRaidBossId(id) ?? null;
}
