import { WowRaids } from '@/wow/raid';
import { PlanStateTimeRange } from './reducer';

const defaultTimeRanges: {
  [key: string]: PlanStateTimeRange[];
} = {};

export const generateDefaultTimeRanges = () => {
  const timeRanges: PlanStateTimeRange[] = [];

  for (let i = 0; i < 600000; i += 30000) {
    timeRanges.push({
      startTime: i === 0 ? 4000 : i,
      endTime: Math.min(i + 29000, 600000),
      excludeInternalIds: [],
      manualPriorities: Array.from({ length: 6 }).map(() => null),
    });
  }
  return timeRanges;
};

WowRaids.forEach((raid) => {
  raid.encounters.forEach((encounter) => {
    defaultTimeRanges[`default-${encounter.id}`] = generateDefaultTimeRanges();
  });
});

export default defaultTimeRanges;
