import { RosterCharacter } from 'flux/roster/types';
import { getClassById } from 'game/classes';
import ActorsJpg from 'images/actors.jpg';
import Image from 'next/image';
import { WCLCharacter } from 'services/wcl/types';

import SPECS from 'game/specs';
import { useMemo } from 'react';

interface Props {
  rosterCharacter: RosterCharacter;
  WCLCharacter: WCLCharacter;
}

export default function LogsSelectBestLogsTableCellSpecIcon({
  rosterCharacter,
  WCLCharacter,
}: Props) {
  const characterClass = getClassById(WCLCharacter?.classID);
  const spec = useMemo(() => {
    if (!rosterCharacter?.specId) return null;
    return SPECS[rosterCharacter?.specId];
  }, [rosterCharacter.specId]);

  if (!characterClass) return null;

  return (
    <div className="relative h-[22px] w-[22px] border border-black">
      <Image
        src={ActorsJpg}
        alt="actors"
        style={
          {
            '--size': 20,
          } as any
        }
        className={`sprite absolute left-0 top-0 h-full w-full actor-sprite-${characterClass?.name.replaceAll(' ', '')}${spec?.wclSpecName ? '-' + spec.wclSpecName.replaceAll(' ', '') : ''}`}
      />
    </div>
  );
}
