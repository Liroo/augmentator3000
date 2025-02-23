import Boss2898Jpg from 'images/raids/nerubarpalace/2898-icon.jpg';
import Boss2902Jpg from 'images/raids/nerubarpalace/2902-icon.jpg';
import Boss2917Jpg from 'images/raids/nerubarpalace/2917-icon.jpg';
import Boss2918Jpg from 'images/raids/nerubarpalace/2918-icon.jpg';
import Boss2919Jpg from 'images/raids/nerubarpalace/2919-icon.jpg';
import Boss2920Jpg from 'images/raids/nerubarpalace/2920-icon.jpg';
import Boss2921Jpg from 'images/raids/nerubarpalace/2921-icon.jpg';
import Boss2922Jpg from 'images/raids/nerubarpalace/2922-icon.jpg';
import Zone38Png from 'images/raids/nerubarpalace/zone-38.png';
import { Zone } from '.';

export default {
  name: "Nerub'ar Palace",
  id: 38,
  icon: Zone38Png,
  partition: 0,
  encounters: [
    {
      name: 'Ulgrax the Devourer',
      id: 2902,
      icon: Boss2902Jpg,
    },
    {
      name: 'The Bloodbound Horror',
      id: 2917,
      icon: Boss2917Jpg,
    },
    {
      name: 'Sikran, Captain of the Sureki',
      id: 2898,
      icon: Boss2898Jpg,
    },
    {
      name: "Rasha'nan",
      id: 2918,
      icon: Boss2918Jpg,
    },
    {
      name: "Broodtwister Ovi'nax",
      id: 2919,
      icon: Boss2919Jpg,
    },
    {
      name: "Nexus-Princess Ky'veza",
      id: 2920,
      icon: Boss2920Jpg,
    },
    {
      name: 'The Silken Court',
      id: 2921,
      icon: Boss2921Jpg,
    },
    {
      name: 'Queen Ansurek',
      id: 2922,
      icon: Boss2922Jpg,
    },
  ],
} satisfies Zone;
