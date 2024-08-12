// a butchered version of https://www.warcraftlogs.com:443/v1/zones
// only includes the raids from Dragonflight (showing older logs wouldn't make sense)
import aberrus from 'game/raids/aberrus';
import amirdrassil from 'game/raids/amirdrassil';
import vaultOfTheIncarnates from 'game/raids/vaultoftheincarnates';

interface Encounter {
  id: number;
  name: string;
}

export interface Zone {
  id: number;
  name: string;
  frozen?: boolean;
  encounters: Encounter[];
  usePtrTooltips?: boolean;
  partition?: number;
}

const ZONES: Zone[] = [
  {
    id: 31,
    name: 'Vault of the Incarnates',
    frozen: false,
    partition: 4,
    encounters: [
      vaultOfTheIncarnates.bosses.Eranog,
      vaultOfTheIncarnates.bosses.Terros,
      vaultOfTheIncarnates.bosses.PrimalCouncil,
      vaultOfTheIncarnates.bosses.Sennarth,
      vaultOfTheIncarnates.bosses.Dathea,
      vaultOfTheIncarnates.bosses.KurogGrimtotem,
      vaultOfTheIncarnates.bosses.BroodkeeperDiurna,
      vaultOfTheIncarnates.bosses.Raszageth,
    ],
  },
  {
    id: 33,
    name: 'Aberrus, the Shadowed Crucible',
    frozen: false,
    partition: 6,
    encounters: [
      aberrus.bosses.Kazzara,
      aberrus.bosses.AmalgamationChamber,
      aberrus.bosses.ForgottenExperiments,
      aberrus.bosses.AssaultOfTheZaqali,
      aberrus.bosses.Rashok,
      aberrus.bosses.Zskarn,
      aberrus.bosses.Magmorax,
      aberrus.bosses.EchoOfNeltharion,
      aberrus.bosses.Sarkareth,
    ],
    usePtrTooltips: false,
  },
  {
    id: 35,
    name: "Amirdrassil, the Dream's Hope",
    frozen: false,
    partition: 3,
    encounters: [
      amirdrassil.bosses.Gnarlroot,
      amirdrassil.bosses.Igira,
      amirdrassil.bosses.Volcoross,
      amirdrassil.bosses.CouncilOfDreams,
      amirdrassil.bosses.Larodar,
      amirdrassil.bosses.Nymue,
      amirdrassil.bosses.Smolderon,
      amirdrassil.bosses.Tindral,
      amirdrassil.bosses.Fyrakk,
    ],
    usePtrTooltips: false,
  },
  {
    id: 38,
    name: "Nerub'ar Palace",
    frozen: false,
    encounters: [],
  },
];

export default ZONES;
