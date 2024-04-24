import { WowRaids } from '@/wow/raid';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import defaultTimeRanges from './defaultTimeRanges';

export type PlanStateTimeRange = {
  startTime: number;
  endTime: number;
  excludeCanonicalIDs: string[];
  manualPriorities: string[];
};

export interface PlanState {
  encounterForm: {
    zoneID: number;
    encounterID: number;
    timeRangesKey: string;
  };

  timeRanges: {
    [key: string]: Array<{
      startTime: number;
      endTime: number;
      excludeCanonicalIDs: string[];
      manualPriorities: string[];
    }>;
  };
}

const initialState: PlanState = {
  encounterForm: {
    zoneID: WowRaids[0].id,
    encounterID: WowRaids[0].encounters[0].id,
    timeRangesKey: 'default',
  },
  timeRanges: defaultTimeRanges,
};

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    setEncounterForm: (state, action) => {
      state.encounterForm = { ...state.encounterForm, ...action.payload };
    },
    setTimeRangesByKey: (
      state,
      action: PayloadAction<{ key: string; timeRanges: PlanStateTimeRange[] }>,
    ) => {
      state.timeRanges[action.payload.key] = action.payload.timeRanges;
    },
    removeTimeRangesByKey: (state, action: PayloadAction<string>) => {
      delete state.timeRanges[action.payload];
    },
  },
});

export const { setEncounterForm, setTimeRangesByKey, removeTimeRangesByKey } =
  planSlice.actions;

export default planSlice;
