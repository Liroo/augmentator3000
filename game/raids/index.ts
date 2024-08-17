import Aberrus from 'game/raids/aberrus';
import Amirdrassil from 'game/raids/amirdrassil';
import VaultOfTheIncarnates from 'game/raids/vaultoftheincarnates';
import { StaticImageData } from 'next/image';
import NerubarPalace from './nerubarpalace';

interface Encounter {
  id: number;
  name: string;
  icon: StaticImageData;
}

export interface Boss extends Encounter {}

export interface Zone {
  id: number;
  name: string;
  icon: StaticImageData;
  partition?: number;
  encounters: Boss[];
}

export const Raids = [
  VaultOfTheIncarnates, // tier 29
  Aberrus, // tier 30
  Amirdrassil, // tier 31
  NerubarPalace, // tier 32
];

export const getRaidByZoneId = (zoneId: number): Zone | undefined => {
  return Raids.find((raid) => raid.id === zoneId);
};

export const getEncounterByEncounterId = (
  encounterId: number,
): Encounter | undefined => {
  return Raids.flatMap((raid) => raid.encounters).find(
    (encounter) => encounter.id === encounterId,
  );
};
