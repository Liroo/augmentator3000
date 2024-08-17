'use client';

import BossSelect from 'components/block/bossSelect';
import LogsSelect from 'components/block/logsSelect';
import Roster from 'components/block/roster';
import CoreLogEventScreen from 'components/core/logEventScreen';
import { selectAuthBearerToken } from 'flux/auth/selector';
import { useAppSelector } from 'flux/hooks';

export default function Home() {
  const bearerToken = useAppSelector(selectAuthBearerToken);

  return (
    <main
      className={`my-[16px] flex flex-col gap-[16px] ${bearerToken ? '' : 'pointer-events-none opacity-50'}`}
    >
      <Roster />

      <BossSelect />

      <LogsSelect />

      <CoreLogEventScreen location="home" />
    </main>
  );
}
