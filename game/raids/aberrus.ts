import Boss2680Jpg from 'images/raids/aberrus/2680-icon.jpg';
import Boss2682Jpg from 'images/raids/aberrus/2682-icon.jpg';
import Boss2683Jpg from 'images/raids/aberrus/2683-icon.jpg';
import Boss2684Jpg from 'images/raids/aberrus/2684-icon.jpg';
import Boss2685Jpg from 'images/raids/aberrus/2685-icon.jpg';
import Boss2687Jpg from 'images/raids/aberrus/2687-icon.jpg';
import Boss2688Jpg from 'images/raids/aberrus/2688-icon.jpg';
import Boss2689Jpg from 'images/raids/aberrus/2689-icon.jpg';
import Boss2693Jpg from 'images/raids/aberrus/2693-icon.jpg';
import Zone33Png from 'images/raids/aberrus/zone-33.png';
import { Zone } from '.';

export default {
  name: 'Aberrus, the Shadowed Crucible',
  id: 33,
  icon: Zone33Png,
  partition: 6,
  encounters: [
    {
      name: 'Kazzara, the Hellforged',
      id: 2688,
      icon: Boss2688Jpg,
    },
    {
      name: 'The Amalgamation Chamber',
      id: 2687,
      icon: Boss2687Jpg,
    },
    {
      name: 'The Forgotten Experiments',
      id: 2693,
      icon: Boss2693Jpg,
    },
    {
      name: 'Assault of the Zaqali',
      id: 2682,
      icon: Boss2682Jpg,
    },
    {
      name: 'Rashok, the Elder',
      id: 2680,
      icon: Boss2680Jpg,
    },
    {
      name: 'The Vigilant Steward, Zskarn',
      id: 2689,
      icon: Boss2689Jpg,
    },
    {
      name: 'Magmorax',
      id: 2683,
      icon: Boss2683Jpg,
    },
    {
      name: 'Echo of Neltharion',
      id: 2684,
      icon: Boss2684Jpg,
    },
    {
      name: 'Scalecommander Sarkareth',
      id: 2685,
      icon: Boss2685Jpg,
    },
  ],
} satisfies Zone;
