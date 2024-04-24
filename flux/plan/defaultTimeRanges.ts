import { PlanStateTimeRange } from './reducer';

const defaultTimeRanges: {
  [key: string]: PlanStateTimeRange[];
} = {
  default: [],
};

for (let i = 3000; i < 600000; i += 30000) {
  defaultTimeRanges.default.push({
    startTime: i,
    endTime: Math.min(i + 27000, 600000),
    excludeCanonicalIDs: [],
    manualPriorities: Array.from({ length: 6 }).map(() => 'default'),
  });
}

export default defaultTimeRanges;
