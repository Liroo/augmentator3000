'use client';

import Analysis from 'components/block/analysis';
import BossSelect from 'components/block/bossSelect';
import LogsSelect from 'components/block/logsSelect';
import Roster from 'components/block/roster';
import TimeRange from 'components/block/timeRange';
import WaNote from 'components/block/waNote';
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

      <TimeRange />

      <Analysis />

      <WaNote />

      <CoreLogEventScreen location="home" />
    </main>
  );
}
