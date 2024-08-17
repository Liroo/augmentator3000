const DIFFICULTIES = {
  LFR_RAID: 1,
  NORMAL_RAID: 3,
  HEROIC_RAID: 4,
  MYTHIC_RAID: 5,
};

export const Difficulties = [
  {
    label: 'LFR',
    value: DIFFICULTIES.LFR_RAID,
  },
  {
    label: 'Normal',
    value: DIFFICULTIES.NORMAL_RAID,
  },
  {
    label: 'Heroic',
    value: DIFFICULTIES.HEROIC_RAID,
  },
  {
    label: 'Mythic',
    value: DIFFICULTIES.MYTHIC_RAID,
  },
];
export default DIFFICULTIES;
