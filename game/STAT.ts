export enum PRIMARY_STAT {
  STRENGTH = 'strength',
  AGILITY = 'agility',
  INTELLECT = 'intellect',
}

export enum SECONDARY_STAT {
  CRITICAL_STRIKE = 'criticalstrike',
  HASTE = 'haste',
  MASTERY = 'mastery',
  VERSATILITY = 'versatility',
}

enum OTHER_STAT {
  HEALTH = 'health',
  STAMINA = 'stamina',
  MANA = 'mana',
  HASTE_HPCT = 'hastehpct',
  HASTE_HPM = 'hastehpm',
  VERSATILITY_DR = 'versatilitydr',
  LEECH = 'leech',
  AVOIDANCE = 'avoidance',
  SPEED = 'speed',
  ARMOR = 'armor',
  UNKNOWN = 'unknown',
}

type STAT = PRIMARY_STAT | SECONDARY_STAT | OTHER_STAT;

const STAT = {
  ...PRIMARY_STAT,
  ...SECONDARY_STAT,
  ...OTHER_STAT,
};

export default STAT;

export function getName(stat: STAT) {
  switch (stat) {
    case STAT.HEALTH:
      return 'Health';
    case STAT.STAMINA:
      return 'Stamina';
    case STAT.MANA:
      return 'Mana';
    case STAT.STRENGTH:
      return 'Strength';
    case STAT.AGILITY:
      return 'Agility';
    case STAT.INTELLECT:
      return 'Intellect';
    case STAT.CRITICAL_STRIKE:
      return 'Critical Strike';
    case STAT.HASTE:
      return 'Haste';
    case STAT.HASTE_HPCT:
      return 'Haste (HPCT)';
    case STAT.HASTE_HPM:
      return 'Haste (HPM)';
    case STAT.MASTERY:
      return 'Mastery';
    case STAT.VERSATILITY:
      return 'Versatility';
    case STAT.VERSATILITY_DR:
      return 'Versatility (with DR)';
    case STAT.LEECH:
      return 'Leech';
    case STAT.AVOIDANCE:
      return 'Avoidance';
    case STAT.SPEED:
      return 'Speed';
    case STAT.ARMOR:
      return 'Armor';
    default:
      return null;
  }
}

export function getClassNameColor(stat: STAT) {
  switch (stat) {
    case STAT.HEALTH:
      return 'stat-health';
    case STAT.STAMINA:
      return 'stat-stamina';
    case STAT.MANA:
      return 'stat-mana';
    case STAT.STRENGTH:
      return 'stat-strength';
    case STAT.AGILITY:
      return 'stat-agility';
    case STAT.INTELLECT:
      return 'stat-intellect';
    case STAT.CRITICAL_STRIKE:
      return 'stat-criticalstrike';
    case STAT.HASTE:
      return 'stat-haste';
    case STAT.HASTE_HPCT:
      return 'stat-haste';
    case STAT.HASTE_HPM:
      return 'stat-haste';
    case STAT.MASTERY:
      return 'stat-mastery';
    case STAT.VERSATILITY:
      return 'stat-versatility';
    case STAT.VERSATILITY_DR:
      return 'stat-versatility';
    case STAT.LEECH:
      return 'stat-leech';
    case STAT.AVOIDANCE:
      return 'stat-avoidance';
    case STAT.SPEED:
      return 'stat-speed';
    case STAT.ARMOR:
      return 'stat-armor';
    default:
      return null;
  }
}
