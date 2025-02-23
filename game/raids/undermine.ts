import Boss3009Jpg from 'images/raids/undermine/3009-icon.jpg';
import Boss3010Jpg from 'images/raids/undermine/3010-icon.jpg';
import Boss3011Jpg from 'images/raids/undermine/3011-icon.jpg';
import Boss3012Jpg from 'images/raids/undermine/3012-icon.jpg';
import Boss3013Jpg from 'images/raids/undermine/3013-icon.jpg';
import Boss3014Jpg from 'images/raids/undermine/3014-icon.jpg';
import Boss3015Jpg from 'images/raids/undermine/3015-icon.jpg';
import Boss3016Jpg from 'images/raids/undermine/3016-icon.jpg';
import Zone42Png from 'images/raids/undermine/zone-42.png';
import { Zone } from '.';

export default {
  name: 'Liberation of Undermine',
  id: 42,
  icon: Zone42Png,
  partition: 0,
  encounters: [
    {
      name: 'Vexie and the Geargrinders',
      id: 3009,
      icon: Boss3009Jpg,
    },
    {
      name: 'Cauldron of Carnage',
      id: 3010,
      icon: Boss3010Jpg,
    },
    {
      name: 'Rik Reverb',
      id: 3011,
      icon: Boss3011Jpg,
    },
    {
      name: 'Stix Bunkjunker',
      id: 3012,
      icon: Boss3012Jpg,
    },
    {
      name: 'Sprocketmonger Lockenstock',
      id: 3013,
      icon: Boss3013Jpg,
    },
    {
      name: 'One-Armed Bandit',
      id: 3014,
      icon: Boss3014Jpg,
    },
    {
      name: "Mug'Zee, Heads of Security",
      id: 3015,
      icon: Boss3015Jpg,
    },
    {
      name: 'Chrome King Gallywix',
      id: 3016,
      icon: Boss3016Jpg,
    },
  ],
} satisfies Zone;
