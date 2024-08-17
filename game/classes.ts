import {
  DEATH_KNIGHT_SPECS,
  DEMON_HUNTER_SPECS,
  DRUID_SPECS,
  EVOKER_SPECS,
  HUNTER_SPECS,
  MAGE_SPECS,
  MONK_SPECS,
  PALADIN_SPECS,
  PRIEST_SPECS,
  ROGUE_SPECS,
  SHAMAN_SPECS,
  Spec,
  WARLOCK_SPECS,
  WARRIOR_SPECS,
} from './specs';

export enum CLASSES {
  DEATH_KNIGHT,
  DEMON_HUNTER,
  DRUID,
  EVOKER,
  HUNTER,
  MAGE,
  MONK,
  PALADIN,
  PRIEST,
  ROGUE,
  SHAMAN,
  WARLOCK,
  WARRIOR,
}

interface Class {
  id: number;
  class: CLASSES;
  name: string;
  specs: Spec[];
}

export const Mage: Class = {
  id: 4,
  class: CLASSES.MAGE,
  name: 'Mage',
  specs: MAGE_SPECS,
};

export const Paladin: Class = {
  id: 6,
  class: CLASSES.PALADIN,
  name: 'Paladin',
  specs: PALADIN_SPECS,
};

export const Warrior: Class = {
  id: 11,
  class: CLASSES.WARRIOR,
  name: 'Warrior',
  specs: WARRIOR_SPECS,
};

export const Druid: Class = {
  id: 2,
  class: CLASSES.DRUID,
  name: 'Druid',
  specs: DRUID_SPECS,
};

export const DeathKnight: Class = {
  id: 1,
  class: CLASSES.DEATH_KNIGHT,
  name: 'Death Knight',
  specs: DEATH_KNIGHT_SPECS,
};

export const Hunter: Class = {
  id: 3,
  class: CLASSES.HUNTER,
  name: 'Hunter',
  specs: HUNTER_SPECS,
};
export const Priest: Class = {
  id: 7,
  class: CLASSES.PRIEST,
  name: 'Priest',
  specs: PRIEST_SPECS,
};

export const Rogue: Class = {
  id: 8,
  class: CLASSES.ROGUE,
  name: 'Rogue',
  specs: ROGUE_SPECS,
};

export const Shaman: Class = {
  id: 9,
  class: CLASSES.SHAMAN,
  name: 'Shaman',
  specs: SHAMAN_SPECS,
};

export const Warlock: Class = {
  id: 10,
  class: CLASSES.WARLOCK,
  name: 'Warlock',
  specs: WARLOCK_SPECS,
};

export const Monk: Class = {
  id: 5,
  class: CLASSES.MONK,
  name: 'Monk',
  specs: MONK_SPECS,
};

export const DemonHunter: Class = {
  id: 12,
  class: CLASSES.DEMON_HUNTER,
  name: 'Demon Hunter',
  specs: DEMON_HUNTER_SPECS,
};

export const Evoker: Class = {
  id: 13,
  class: CLASSES.EVOKER,
  name: 'Evoker',
  specs: EVOKER_SPECS,
};

export function getClassById(id: number): Class | undefined {
  switch (id) {
    case Mage.id:
      return Mage;
    case Paladin.id:
      return Paladin;
    case Warrior.id:
      return Warrior;
    case Druid.id:
      return Druid;
    case DeathKnight.id:
      return DeathKnight;
    case Hunter.id:
      return Hunter;
    case Priest.id:
      return Priest;
    case Rogue.id:
      return Rogue;
    case Shaman.id:
      return Shaman;
    case Warlock.id:
      return Warlock;
    case Monk.id:
      return Monk;
    case DemonHunter.id:
      return DemonHunter;
    case Evoker.id:
      return Evoker;
    default:
      return undefined;
  }
}

export function getClassBySpecId(specId: number) {
  if (DEATH_KNIGHT_SPECS.find((spec) => spec.id === specId)) {
    return CLASSES.DEATH_KNIGHT;
  }
  if (DEMON_HUNTER_SPECS.find((spec) => spec.id === specId)) {
    return CLASSES.DEMON_HUNTER;
  }
  if (DRUID_SPECS.find((spec) => spec.id === specId)) {
    return CLASSES.DRUID;
  }
  if (EVOKER_SPECS.find((spec) => spec.id === specId)) {
    return CLASSES.EVOKER;
  }
  if (HUNTER_SPECS.find((spec) => spec.id === specId)) {
    return CLASSES.HUNTER;
  }
  if (MAGE_SPECS.find((spec) => spec.id === specId)) {
    return CLASSES.MAGE;
  }
  if (MONK_SPECS.find((spec) => spec.id === specId)) {
    return CLASSES.MONK;
  }
  if (PALADIN_SPECS.find((spec) => spec.id === specId)) {
    return CLASSES.PALADIN;
  }
  if (PRIEST_SPECS.find((spec) => spec.id === specId)) {
    return CLASSES.PRIEST;
  }
  if (ROGUE_SPECS.find((spec) => spec.id === specId)) {
    return CLASSES.ROGUE;
  }
  if (SHAMAN_SPECS.find((spec) => spec.id === specId)) {
    return CLASSES.SHAMAN;
  }
  if (WARLOCK_SPECS.find((spec) => spec.id === specId)) {
    return CLASSES.WARLOCK;
  }
  if (WARRIOR_SPECS.find((spec) => spec.id === specId)) {
    return CLASSES.WARRIOR;
  }
  //random non class number to avoid potentially returning undefined
  return Infinity;
}
