import { WowRaids } from '@/wow/raid';
import { createSlice } from '@reduxjs/toolkit';

export interface PlanState {
  encounterForm: {
    zoneID: number;
    encounterID: number;
  };

  timeRanges: {
    [key: string]: [number, number][];
  };
}

const initialState: PlanState = {
  encounterForm: {
    zoneID: WowRaids[0].id,
    encounterID: WowRaids[0].encounters[0].id,
  },
  timeRanges: {
    default: [],
  },
};

for (let i = 3000; i < 18000000; i += 30000) {
  initialState.timeRanges.default.push([i, Math.min(i + 30000, 18000000)]);
}

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    setEncounterForm: (state, action) => {
      state.encounterForm = action.payload;
    },
  },
});

export const { setEncounterForm } = planSlice.actions;

export default planSlice;
