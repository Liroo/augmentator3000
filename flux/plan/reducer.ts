import { WowRaids } from '@/wow/raid';
import { createSlice } from '@reduxjs/toolkit';

export interface PlanState {
  encounterForm: {
    zoneID: number;
    encounterID: number;
  };
}

const initialState: PlanState = {
  encounterForm: {
    zoneID: WowRaids[0].id,
    encounterID: WowRaids[0].encounters[0].id,
  },
};

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
