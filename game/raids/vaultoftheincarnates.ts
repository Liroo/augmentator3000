import Boss2587Png from 'images/raids/vaultoftheincarnates/2587-icon.jpg';
import Boss2590Png from 'images/raids/vaultoftheincarnates/2590-icon.jpg';
import Boss2592Png from 'images/raids/vaultoftheincarnates/2592-icon.jpg';
import Boss2605Png from 'images/raids/vaultoftheincarnates/2605-icon.jpg';
import Boss2607Png from 'images/raids/vaultoftheincarnates/2607-icon.jpg';
import Boss2614Png from 'images/raids/vaultoftheincarnates/2614-icon.jpg';
import Boss2635Png from 'images/raids/vaultoftheincarnates/2635-icon.jpg';
import Boss2639Png from 'images/raids/vaultoftheincarnates/2639-icon.jpg';
import Zone31Png from 'images/raids/vaultoftheincarnates/zone-31.png';
import { Zone } from '.';

export default {
  name: 'Vault of the Incarnates',
  id: 31,
  icon: Zone31Png,
  partition: 4,
  encounters: [
    {
      name: 'Eranog',
      id: 2587,
      icon: Boss2587Png,
    },
    {
      name: 'Terros',
      id: 2639,
      icon: Boss2639Png,
    },
    {
      name: 'The Primal Council',
      id: 2590,
      icon: Boss2590Png,
    },
    {
      name: 'Sennarth, The Cold Breath',
      id: 2592,
      icon: Boss2592Png,
    },
    {
      name: 'Dathea, Ascended',
      id: 2635,
      icon: Boss2635Png,
    },
    {
      name: 'Kurog Grimtotem',
      id: 2605,
      icon: Boss2605Png,
    },
    {
      name: 'Broodkeeper Diurna',
      id: 2614,
      icon: Boss2614Png,
    },
    {
      name: 'Raszageth the Storm-Eater',
      id: 2607,
      icon: Boss2607Png,
    },
  ],
} satisfies Zone;
