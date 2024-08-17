import Boss2677Jpg from 'images/raids/amirdrassil/2677-icon.jpg';
import Boss2708Jpg from 'images/raids/amirdrassil/2708-icon.jpg';
import Boss2709Jpg from 'images/raids/amirdrassil/2709-icon.jpg';
import Boss2728Jpg from 'images/raids/amirdrassil/2728-icon.jpg';
import Boss2731Jpg from 'images/raids/amirdrassil/2731-icon.jpg';
import Boss2737Jpg from 'images/raids/amirdrassil/2737-icon.jpg';
import Boss2786Jpg from 'images/raids/amirdrassil/2786-icon.jpg';
import Boss2820Jpg from 'images/raids/amirdrassil/2820-icon.jpg';
import Boss2824Jpg from 'images/raids/amirdrassil/2824-icon.jpg';
import Zone35Png from 'images/raids/amirdrassil/zone-35.png';
import { Zone } from '.';

export default {
  name: "Amirdrassil, the Dream's Hope",
  id: 35,
  icon: Zone35Png,
  partition: 3,
  encounters: [
    {
      name: 'Gnarlroot',
      id: 2820,
      icon: Boss2820Jpg,
    },
    {
      name: 'Igira the Cruel',
      id: 2709,
      icon: Boss2709Jpg,
    },
    {
      name: 'Volcoross',
      id: 2737,
      icon: Boss2737Jpg,
    },
    {
      name: 'Council of Dreams',
      id: 2728,
      icon: Boss2728Jpg,
    },
    {
      name: 'Larodar, Keeper of the Flame',
      id: 2731,
      icon: Boss2731Jpg,
    },
    {
      name: 'Nymue, Weaver of the Cycle',
      id: 2708,
      icon: Boss2708Jpg,
    },
    {
      name: 'Smolderon',
      id: 2824,
      icon: Boss2824Jpg,
    },
    {
      name: 'Tindral Sageswift, Seer of the Flame',
      id: 2786,
      icon: Boss2786Jpg,
    },
    {
      name: 'Fyrakk the Blazing',
      id: 2677,
      icon: Boss2677Jpg,
    },
  ],
} satisfies Zone;
