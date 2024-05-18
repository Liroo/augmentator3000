import { WowRaids } from '@/wow/raid';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import defaultTimeRanges from './defaultTimeRanges';

export type PlanStateTimeRange = {
  startTime: number;
  endTime: number;
  excludeInternalIds: string[];
  manualPriorities: (string | null)[];
};

export interface PlanState {
  encounterForm: {
    zoneID: number;
    encounterID: number;
    timeRangesKey: string;
  };

  timeRanges: {
    [key: string]: Array<PlanStateTimeRange>;
  };

  selectedFightsFromReportWithFights: {
    [code: string]: number[];
  };
}

const initialState: PlanState = {
  encounterForm: {
    zoneID: WowRaids[0].id,
    encounterID: WowRaids[0].encounters[0].id,
    timeRangesKey: 'default',
  },
  timeRanges: defaultTimeRanges,
  selectedFightsFromReportWithFights: {},
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
    renameTimeRangesByKey: (
      state,
      action: PayloadAction<{ key: string; newKey: string }>,
    ) => {
      state.timeRanges[action.payload.newKey] =
        state.timeRanges[action.payload.key];
      delete state.timeRanges[action.payload.key];
    },
    removeTimeRangesByKey: (state, action: PayloadAction<string>) => {
      delete state.timeRanges[action.payload];
    },
    setSelectedFightsFromReportWithFights: (
      state,
      action: PayloadAction<{ code: string; fights: number[] }>,
    ) => {
      state.selectedFightsFromReportWithFights[action.payload.code] =
        action.payload.fights;
    },
  },
});

export const {
  setEncounterForm,
  setTimeRangesByKey,
  renameTimeRangesByKey,
  removeTimeRangesByKey,
  setSelectedFightsFromReportWithFights,
} = planSlice.actions;

export default planSlice;
