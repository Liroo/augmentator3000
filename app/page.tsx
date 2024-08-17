'use client';

import BossSelect from 'components/block/bossSelect';
import LogsSelect from 'components/block/logsSelect';
import Roster from 'components/block/roster';
import CoreLogEventScreen from 'components/core/logEventScreen';

export default function Home() {
  return (
    <main className="my-[16px] flex flex-col gap-[16px]">
      <Roster />

      <BossSelect />

      <LogsSelect />

      <CoreLogEventScreen location="home" />
    </main>
  );
}
