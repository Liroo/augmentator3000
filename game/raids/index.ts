import Aberrus from 'game/raids/aberrus';
import Amirdrassil from 'game/raids/amirdrassil';
import {
  bot as BastionOfTwilight,
  bwd as BlackwingDescent,
  totfw as ThroneOfTheFourWinds,
} from 'game/raids/cata_bwd_bot_totfw';
import MythicPlusSeasonFour from 'game/raids/mythicplusseasonfour';
import MythicPlusSeasonOne from 'game/raids/mythicplusseasonone';
import MythicPlusSeasonThree from 'game/raids/mythicplusseasonthree';
import MythicPlusSeasonTwo from 'game/raids/mythicplusseasontwo';
import VaultOfTheIncarnates from 'game/raids/vaultoftheincarnates';
import { StaticImageData } from 'next/image';
import PhaseConfig from 'parser/core/PhaseConfig';

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

const dungeons = {
  // Dragonflight
  MythicPlusSeasonOne,
  MythicPlusSeasonTwo,
  MythicPlusSeasonThree,
  MythicPlusSeasonFour,
};

const raids = {
  VaultOfTheIncarnates, // tier 29
  Aberrus, // tier 30
  Amirdrassil, // tier 31
  // Cataclysm (Classic)
  BlackwingDescent,
  BastionOfTwilight,
  ThroneOfTheFourWinds,
};

function findByDungeonBossId(id: number) {
  return Object.values(dungeons)
    .flatMap((dungeon) => Object.values(dungeon.bosses))
    .find((boss) => boss.id === id);
}

function findByRaidBossId(id: number) {
  return Object.values(raids)
    .flatMap((raid) => Object.values(raid.bosses))
    .find((boss) => boss.id === id);
}

export function findByBossId(id: number) {
  return findByRaidBossId(id) ?? findByDungeonBossId(id) ?? null;
}
