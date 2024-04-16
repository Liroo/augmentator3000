import { useRect } from '@/hooks/useRect';
import { WCLCharacter } from '@/wcl/wcl';
import { getClassObjectById } from '@/wow/class';
import ActorsJpg from 'images/actors.jpg';
import Image from 'next/image';
import { useRef } from 'react';

interface Props {
  character: WCLCharacter;
}

export default function ViewEditRosterTableCellSpecIcon({ character }: Props) {
  if (!character.classID) return null;
  const characterClassObject = getClassObjectById(character.classID);
  const characterClassName = characterClassObject.name.replace(' ', '');
  const characterSpecName = characterClassObject.specs
    .find((spec) => spec.id === character.specID)
    ?.name.replace(' ', '');
  const ref = useRef(null);
  const { height } = useRect(ref);

  return (
    <div className="relative h-[30px] w-[30px] border border-black">
      <Image
        ref={ref}
        src={ActorsJpg}
        alt="actors"
        style={
          {
            '--size': height,
          } as any
        }
        className={`sprite absolute left-0 top-0 h-full w-full actor-sprite-${characterClassName}${characterSpecName ? '-' + characterSpecName : ''}`}
      />
    </div>
  );
}
