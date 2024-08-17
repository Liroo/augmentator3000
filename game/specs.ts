import indexById from 'utils/indexById';

import ROLES from './roles';

interface BaseSpec {
  id: number;
  type?: string;
  index: number;
  role: number;
  ranking: { class: number; spec: number };
  /**
   * String key used by WCL to identify the class.
   */
  wclClassName: string;
  /**
   * String key used by WCL to identify the spec.
   */
  wclSpecName: string;
}

export interface RetailSpec extends BaseSpec {}

export type Spec = RetailSpec;

const SPECS = {
  ARCANE_MAGE: {
    id: 62,
    index: 0,
    wclClassName: 'Mage',
    wclSpecName: 'Arcane',
    role: ROLES.DPS.RANGED,
    ranking: {
      class: 4,
      spec: 1,
    },
  },
  FIRE_MAGE: {
    id: 63,
    index: 1,
    wclClassName: 'Mage',
    wclSpecName: 'Fire',
    role: ROLES.DPS.RANGED,
    ranking: {
      class: 4,
      spec: 2,
    },
  },
  FROST_MAGE: {
    id: 64,
    index: 2,
    wclClassName: 'Mage',
    wclSpecName: 'Frost',
    role: ROLES.DPS.RANGED,
    ranking: {
      class: 4,
      spec: 3,
    },
  },
  HOLY_PALADIN: {
    id: 65,
    index: 3,
    wclClassName: 'Paladin',
    wclSpecName: 'Holy',
    role: ROLES.HEALER,
    ranking: {
      class: 6,
      spec: 1,
    },
  },
  PROTECTION_PALADIN: {
    id: 66,
    index: 4,
    wclClassName: 'Paladin',
    wclSpecName: 'Protection',
    role: ROLES.TANK,
    ranking: {
      class: 6,
      spec: 2,
    },
  },
  RETRIBUTION_PALADIN: {
    id: 70,
    index: 5,
    wclClassName: 'Paladin',
    wclSpecName: 'Retribution',
    role: ROLES.DPS.MELEE,
    ranking: {
      class: 6,
      spec: 3,
    },
  },
  ARMS_WARRIOR: {
    id: 71,
    index: 6,
    wclClassName: 'Warrior',
    wclSpecName: 'Arms',
    role: ROLES.DPS.MELEE,
    ranking: {
      class: 11,
      spec: 1,
    },
  },
  FURY_WARRIOR: {
    id: 72,
    index: 7,
    wclClassName: 'Warrior',
    wclSpecName: 'Fury',
    role: ROLES.DPS.MELEE,
    ranking: {
      class: 11,
      spec: 2,
    },
  },
  PROTECTION_WARRIOR: {
    id: 73,
    index: 8,
    wclClassName: 'Warrior',
    wclSpecName: 'Protection',
    role: ROLES.TANK,
    ranking: {
      class: 11,
      spec: 3,
    },
  },
  BALANCE_DRUID: {
    id: 102,
    index: 9,
    wclClassName: 'Druid',
    wclSpecName: 'Balance',
    role: ROLES.DPS.RANGED,
    ranking: {
      class: 2,
      spec: 1,
    },
  },
  FERAL_DRUID: {
    id: 103,
    index: 10,
    wclClassName: 'Druid',
    wclSpecName: 'Feral',
    role: ROLES.DPS.MELEE,
    ranking: {
      class: 2,
      spec: 2,
    },
  },
  GUARDIAN_DRUID: {
    id: 104,
    index: 11,
    wclClassName: 'Druid',
    wclSpecName: 'Guardian',
    role: ROLES.TANK,
    ranking: {
      class: 2,
      spec: 3,
    },
  },
  RESTORATION_DRUID: {
    id: 105,
    index: 12,
    wclClassName: 'Druid',
    wclSpecName: 'Restoration',
    role: ROLES.HEALER,
    ranking: {
      class: 2,
      spec: 4,
    },
  },
  BLOOD_DEATH_KNIGHT: {
    id: 250,
    index: 13,
    wclClassName: 'Death Knight',
    wclSpecName: 'Blood',
    role: ROLES.TANK,
    ranking: {
      class: 1,
      spec: 1,
    },
  },
  FROST_DEATH_KNIGHT: {
    id: 251,
    index: 14,
    wclClassName: 'Death Knight',
    wclSpecName: 'Frost',
    role: ROLES.DPS.MELEE,
    ranking: {
      class: 1,
      spec: 2,
    },
  },
  UNHOLY_DEATH_KNIGHT: {
    id: 252,
    index: 15,
    wclClassName: 'Death Knight',
    wclSpecName: 'Unholy',
    role: ROLES.DPS.MELEE,
    ranking: {
      class: 1,
      spec: 3,
    },
  },
  BEAST_MASTERY_HUNTER: {
    id: 253,
    index: 16,
    wclClassName: 'Hunter',
    wclSpecName: 'Beast Mastery',
    role: ROLES.DPS.RANGED,
    ranking: {
      class: 3,
      spec: 1,
    },
  },
  MARKSMANSHIP_HUNTER: {
    id: 254,
    index: 17,
    wclClassName: 'Hunter',
    wclSpecName: 'Marksmanship',
    role: ROLES.DPS.RANGED,
    ranking: {
      class: 3,
      spec: 2,
    },
  },
  SURVIVAL_HUNTER: {
    id: 255,
    index: 18,
    wclClassName: 'Hunter',
    wclSpecName: 'Survival',
    role: ROLES.DPS.MELEE,
    ranking: {
      class: 3,
      spec: 3,
    },
  },
  DISCIPLINE_PRIEST: {
    id: 256,
    index: 19,
    wclClassName: 'Priest',
    wclSpecName: 'Discipline',
    role: ROLES.HEALER,
    ranking: {
      class: 7,
      spec: 1,
    },
  },
  HOLY_PRIEST: {
    id: 257,
    index: 20,
    wclClassName: 'Priest',
    wclSpecName: 'Holy',
    role: ROLES.HEALER,
    ranking: {
      class: 7,
      spec: 2,
    },
  },
  SHADOW_PRIEST: {
    id: 258,
    index: 21,
    wclClassName: 'Priest',
    wclSpecName: 'Shadow',
    role: ROLES.DPS.RANGED,
    ranking: {
      class: 7,
      spec: 3,
    },
  },
  ASSASSINATION_ROGUE: {
    id: 259,
    index: 22,
    wclClassName: 'Rogue',
    wclSpecName: 'Assassination',
    role: ROLES.DPS.MELEE,
    ranking: {
      class: 8,
      spec: 1,
    },
  },
  OUTLAW_ROGUE: {
    id: 260,
    index: 23,
    wclClassName: 'Rogue',
    wclSpecName: 'Outlaw',
    role: ROLES.DPS.MELEE,
    ranking: {
      class: 8,
      spec: 4,
    },
  },
  SUBTLETY_ROGUE: {
    id: 261,
    index: 24,
    wclClassName: 'Rogue',
    wclSpecName: 'Subtlety',
    role: ROLES.DPS.MELEE,
    ranking: {
      class: 8,
      spec: 3,
    },
  },
  ELEMENTAL_SHAMAN: {
    id: 262,
    index: 25,
    wclClassName: 'Shaman',
    wclSpecName: 'Elemental',
    role: ROLES.DPS.RANGED,
    ranking: {
      class: 9,
      spec: 1,
    },
  },
  ENHANCEMENT_SHAMAN: {
    id: 263,
    index: 26,
    wclClassName: 'Shaman',
    wclSpecName: 'Enhancement',
    role: ROLES.DPS.MELEE,
    ranking: {
      class: 9,
      spec: 2,
    },
  },
  RESTORATION_SHAMAN: {
    id: 264,
    index: 27,
    wclClassName: 'Shaman',
    wclSpecName: 'Restoration',
    role: ROLES.HEALER,
    ranking: {
      class: 9,
      spec: 3,
    },
  },
  AFFLICTION_WARLOCK: {
    id: 265,
    index: 28,
    wclClassName: 'Warlock',
    wclSpecName: 'Affliction',
    role: ROLES.DPS.RANGED,
    ranking: {
      class: 10,
      spec: 1,
    },
  },
  DEMONOLOGY_WARLOCK: {
    id: 266,
    index: 29,
    wclClassName: 'Warlock',
    wclSpecName: 'Demonology',
    role: ROLES.DPS.RANGED,
    ranking: {
      class: 10,
      spec: 2,
    },
  },
  DESTRUCTION_WARLOCK: {
    id: 267,
    index: 30,
    wclClassName: 'Warlock',
    wclSpecName: 'Destruction',
    role: ROLES.DPS.RANGED,
    ranking: {
      class: 10,
      spec: 3,
    },
  },
  BREWMASTER_MONK: {
    id: 268,
    index: 31,
    wclClassName: 'Monk',
    wclSpecName: 'Brewmaster',
    role: ROLES.TANK,
    ranking: {
      class: 5,
      spec: 1,
    },
  },
  WINDWALKER_MONK: {
    id: 269,
    index: 32,
    wclClassName: 'Monk',
    wclSpecName: 'Windwalker',
    role: ROLES.DPS.MELEE,
    ranking: {
      class: 5,
      spec: 3,
    },
  },
  MISTWEAVER_MONK: {
    id: 270,
    index: 33,
    wclClassName: 'Monk',
    wclSpecName: 'Mistweaver',
    role: ROLES.HEALER,
    ranking: {
      class: 5,
      spec: 2,
    },
  },
  HAVOC_DEMON_HUNTER: {
    id: 577,
    index: 34,
    wclClassName: 'Demon Hunter',
    wclSpecName: 'Havoc',
    role: ROLES.DPS.MELEE,
    ranking: {
      class: 12,
      spec: 1,
    },
  },
  VENGEANCE_DEMON_HUNTER: {
    id: 581,
    index: 35,
    wclClassName: 'Demon Hunter',
    wclSpecName: 'Vengeance',
    role: ROLES.TANK,
    ranking: {
      class: 12,
      spec: 2,
    },
  },
  DEVASTATION_EVOKER: {
    id: 1467,
    index: 36,
    wclClassName: 'Evoker',
    wclSpecName: 'Devastation',
    role: ROLES.DPS.RANGED,
    ranking: {
      class: 13,
      spec: 1,
    },
  },
  PRESERVATION_EVOKER: {
    id: 1468,
    index: 37,
    wclClassName: 'Evoker',
    wclSpecName: 'Preservation',
    role: ROLES.HEALER,
    ranking: {
      class: 13,
      spec: 2,
    },
  },
  AUGMENTATION_EVOKER: {
    id: 1473,
    index: 38,
    wclClassName: 'Evoker',
    wclSpecName: 'Augmentation',
    role: ROLES.DPS.RANGED,
    ranking: {
      class: 13,
      spec: 3,
    },
  },
} satisfies Record<string, Spec>;

export const DEATH_KNIGHT_SPECS: Spec[] = [
  SPECS.BLOOD_DEATH_KNIGHT,
  SPECS.FROST_DEATH_KNIGHT,
  SPECS.UNHOLY_DEATH_KNIGHT,
];
export const DEMON_HUNTER_SPECS: Spec[] = [
  SPECS.HAVOC_DEMON_HUNTER,
  SPECS.VENGEANCE_DEMON_HUNTER,
];
export const DRUID_SPECS: Spec[] = [
  SPECS.FERAL_DRUID,
  SPECS.BALANCE_DRUID,
  SPECS.GUARDIAN_DRUID,
  SPECS.RESTORATION_DRUID,
];
export const EVOKER_SPECS: Spec[] = [
  SPECS.DEVASTATION_EVOKER,
  SPECS.PRESERVATION_EVOKER,
  SPECS.AUGMENTATION_EVOKER,
];
export const HUNTER_SPECS: Spec[] = [
  SPECS.SURVIVAL_HUNTER,
  SPECS.BEAST_MASTERY_HUNTER,
  SPECS.MARKSMANSHIP_HUNTER,
];
export const MAGE_SPECS: Spec[] = [
  SPECS.FROST_MAGE,
  SPECS.FIRE_MAGE,
  SPECS.ARCANE_MAGE,
];
export const MONK_SPECS: Spec[] = [
  SPECS.MISTWEAVER_MONK,
  SPECS.BREWMASTER_MONK,
  SPECS.WINDWALKER_MONK,
];
export const PALADIN_SPECS: Spec[] = [
  SPECS.PROTECTION_PALADIN,
  SPECS.RETRIBUTION_PALADIN,
  SPECS.HOLY_PALADIN,
];
export const PRIEST_SPECS: Spec[] = [
  SPECS.HOLY_PRIEST,
  SPECS.DISCIPLINE_PRIEST,
  SPECS.SHADOW_PRIEST,
];
export const ROGUE_SPECS: Spec[] = [
  SPECS.SUBTLETY_ROGUE,
  SPECS.OUTLAW_ROGUE,
  SPECS.ASSASSINATION_ROGUE,
];
export const SHAMAN_SPECS: Spec[] = [
  SPECS.ELEMENTAL_SHAMAN,
  SPECS.ENHANCEMENT_SHAMAN,
  SPECS.RESTORATION_SHAMAN,
];
export const WARLOCK_SPECS: Spec[] = [
  SPECS.DESTRUCTION_WARLOCK,
  SPECS.DEMONOLOGY_WARLOCK,
  SPECS.AFFLICTION_WARLOCK,
];
export const WARRIOR_SPECS: Spec[] = [
  SPECS.ARMS_WARRIOR,
  SPECS.PROTECTION_WARRIOR,
  SPECS.FURY_WARRIOR,
];

export const specsCount = Object.keys(SPECS).length;
export default indexById<Spec, typeof SPECS>(SPECS);
