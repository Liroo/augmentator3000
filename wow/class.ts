import { WowRole } from './role';

export enum WowClass {
  DeathKnight = 'death-knight',
  DemonHunter = 'demon-hunter',
  Druid = 'druid',
  Evoker = 'evoker',
  Hunter = 'hunter',
  Mage = 'mage',
  Monk = 'monk',
  Paladin = 'paladin',
  Priest = 'priest',
  Rogue = 'rogue',
  Shaman = 'shaman',
  Warlock = 'warlock',
  Warrior = 'warrior',
}

export const WowClassSpec = {
  [WowClass.DeathKnight]: {
    id: 1,
    name: 'Death Knight',
    specs: [
      {
        id: 1,
        name: 'Blood',
        role: WowRole.Tank,
      },
      {
        id: 2,
        name: 'Frost',
        role: WowRole.Damage,
      },
      {
        id: 3,
        name: 'Unholy',
        role: WowRole.Damage,
      },
    ],
  },
  [WowClass.DemonHunter]: {
    id: 12,
    name: 'Demon Hunter',
    specs: [
      {
        id: 1,
        name: 'Havoc',
        role: WowRole.Damage,
      },
      {
        id: 2,
        name: 'Vengeance',
        role: WowRole.Tank,
      },
    ],
  },
  [WowClass.Druid]: {
    id: 2,
    name: 'Druid',
    specs: [
      {
        id: 1,
        name: 'Balance',
        role: WowRole.Damage,
      },
      {
        id: 2,
        name: 'Feral',
        role: WowRole.Damage,
      },
      {
        id: 3,
        name: 'Guardian',
        role: WowRole.Tank,
      },
      {
        id: 4,
        name: 'Restoration',
        role: WowRole.Healer,
      },
    ],
  },
  [WowClass.Evoker]: {
    id: 13,
    name: 'Evoker',
    specs: [
      {
        id: 1,
        name: 'Augmentation',
        role: WowRole.Damage,
      },
      {
        id: 2,
        name: 'Devastation',
        role: WowRole.Damage,
      },
      {
        id: 3,
        name: 'Preservation',
        role: WowRole.Healer,
      },
    ],
  },
  [WowClass.Hunter]: {
    id: 3,
    name: 'Hunter',
    specs: [
      {
        id: 1,
        name: 'Beast Mastery',
        role: WowRole.Damage,
      },
      {
        id: 2,
        name: 'Marksmanship',
        role: WowRole.Damage,
      },
      {
        id: 3,
        name: 'Survival',
        role: WowRole.Damage,
      },
    ],
  },
  [WowClass.Mage]: {
    id: 4,
    name: 'Mage',
    specs: [
      {
        id: 1,
        name: 'Arcane',
        role: WowRole.Damage,
      },
      {
        id: 2,
        name: 'Fire',
        role: WowRole.Damage,
      },
      {
        id: 3,
        name: 'Frost',
        role: WowRole.Damage,
      },
    ],
  },
  [WowClass.Monk]: {
    id: 5,
    name: 'Monk',
    specs: [
      {
        id: 1,
        name: 'Brewmaster',
        role: WowRole.Tank,
      },
      {
        id: 2,
        name: 'Mistweaver',
        role: WowRole.Healer,
      },
      {
        id: 3,
        name: 'Windwalker',
        role: WowRole.Damage,
      },
    ],
  },
  [WowClass.Paladin]: {
    id: 6,
    name: 'Paladin',
    specs: [
      {
        id: 1,
        name: 'Holy',
        role: WowRole.Healer,
      },
      {
        id: 2,
        name: 'Protection',
        role: WowRole.Tank,
      },
      {
        id: 3,
        name: 'Retribution',
        role: WowRole.Damage,
      },
    ],
  },
  [WowClass.Priest]: {
    id: 7,
    name: 'Priest',
    specs: [
      {
        id: 1,
        name: 'Discipline',
        role: WowRole.Healer,
      },
      {
        id: 2,
        name: 'Holy',
        role: WowRole.Healer,
      },
      {
        id: 3,
        name: 'Shadow',
        role: WowRole.Damage,
      },
    ],
  },
  [WowClass.Rogue]: {
    id: 8,
    name: 'Rogue',
    specs: [
      {
        id: 1,
        name: 'Assassination',
        role: WowRole.Damage,
      },
      {
        id: 2,
        name: 'Subtlety',
        role: WowRole.Damage,
      },
      {
        id: 3,
        name: 'Outlaw',
        role: WowRole.Damage,
      },
    ],
  },
  [WowClass.Shaman]: {
    id: 9,
    name: 'Shaman',
    specs: [
      {
        id: 1,
        name: 'Elemental',
        role: WowRole.Damage,
      },
      {
        id: 2,
        name: 'Enhancement',
        role: WowRole.Damage,
      },
      {
        id: 3,
        name: 'Restoration',
        role: WowRole.Healer,
      },
    ],
  },
  [WowClass.Warlock]: {
    id: 10,
    name: 'Warlock',
    specs: [
      {
        id: 1,
        name: 'Affliction',
        role: WowRole.Damage,
      },
      {
        id: 2,
        name: 'Demonology',
        role: WowRole.Damage,
      },
      {
        id: 3,
        name: 'Destruction',
        role: WowRole.Damage,
      },
    ],
  },
  [WowClass.Warrior]: {
    id: 11,
    name: 'Warrior',
    specs: [
      {
        id: 1,
        name: 'Arms',
        role: WowRole.Damage,
      },
      {
        id: 2,
        name: 'Fury',
        role: WowRole.Damage,
      },
      {
        id: 3,
        name: 'Protection',
        role: WowRole.Tank,
      },
    ],
  },
};

export const getClassById = (id: number) => {
  const keys = Object.keys(WowClassSpec);

  return keys.find((key) => WowClassSpec[key as WowClass].id === id) as
    | WowClass
    | undefined;
};

export const getClassObjectById = (id: number) => {
  return WowClassSpec[getClassById(id) as WowClass];
};

export const getClassColor = (wowClass?: WowClass) => {
  switch (wowClass) {
    case WowClass.DeathKnight:
      return '#C41F3B';
    case WowClass.DemonHunter:
      return '#A330C9';
    case WowClass.Druid:
      return '#FF7D0A';
    case WowClass.Evoker:
      return '#33937f';
    case WowClass.Hunter:
      return '#ABD473';
    case WowClass.Mage:
      return '#40C7EB';
    case WowClass.Monk:
      return '#00FF96';
    case WowClass.Paladin:
      return '#F58CBA';
    case WowClass.Priest:
      return '#FFFFFF';
    case WowClass.Rogue:
      return '#FFF569';
    case WowClass.Shaman:
      return '#0070DE';
    case WowClass.Warlock:
      return '#8787ED';
    case WowClass.Warrior:
      return '#C79C6E';
    default:
      return undefined;
  }
};
