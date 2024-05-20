export interface WowRaid {
  name: string;
  partition: number | null;
  id: number;
  encounters: WowRaidBoss[];
}

export interface WowRaidBoss {
  name: string;
  id: number;
}

export const WowRaids: WowRaid[] = [
  {
    name: "Amirdrassil, the Dream's Hope",
    partition: 4,
    id: 35,
    encounters: [
      {
        name: 'Gnarlroot',
        id: 2820,
      },
      {
        name: 'Igira the Cruel',
        id: 2709,
      },
      {
        name: 'Volcoross',
        id: 2737,
      },
      {
        name: 'Council of Dreams',
        id: 2728,
      },
      {
        name: 'Larodar, Keeper of the Flame',
        id: 2731,
      },
      {
        name: 'Nymue, Weaver of the Cycle',
        id: 2708,
      },
      {
        name: 'Smolderon',
        id: 2824,
      },
      {
        name: 'Tindral Sageswift, Seer of the Flame',
        id: 2786,
      },
      {
        name: 'Fyrakk the Blazing',
        id: 2677,
      },
    ],
  },
  {
    name: 'Aberrus, the Shadowed Crucible',
    partition: 7,
    id: 33,
    encounters: [
      {
        name: 'Kazzara, the Hellforged',
        id: 2688,
      },
      {
        name: 'The Amalgamation Chamber',
        id: 2687,
      },
      {
        name: 'The Forgotten Experiments',
        id: 2693,
      },
      {
        name: 'Assault of the Zaqali',
        id: 2682,
      },
      {
        name: 'Rashok, the Elder',
        id: 2680,
      },
      {
        name: 'The Vigilant Steward, Zskarn',
        id: 2689,
      },
      {
        name: 'Magmorax',
        id: 2683,
      },
      {
        name: 'Echo of Neltharion',
        id: 2684,
      },
      {
        name: 'Scalecommander Sarkareth',
        id: 2685,
      },
    ],
  },
  {
    name: 'Vault of the Incarnates',
    partition: 5,
    id: 31,
    encounters: [
      {
        name: 'Eranog',
        id: 2587,
      },
      {
        name: 'Terros',
        id: 2639,
      },
      {
        name: 'The Primal Council',
        id: 2590,
      },
      {
        name: 'Sennarth, The Cold Breath',
        id: 2592,
      },
      {
        name: 'Dathea, Ascended',
        id: 2635,
      },
      {
        name: 'Kurog Grimtotem',
        id: 2605,
      },
      {
        name: 'Broodkeeper Diurna',
        id: 2614,
      },
      {
        name: 'Raszageth the Storm-Eater',
        id: 2607,
      },
    ],
  },
];
