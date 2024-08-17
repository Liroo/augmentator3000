import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import DIFFICULTIES from 'game/difficulties';
import { Raids } from 'game/raids';

export interface PlanState {
  encounterForm: {
    zoneId: number;
    encounterId: number;
    difficulty: number;
  };
  filterCustomReportByEncouterId: boolean;
  customReportFightsSelected: string[];
  bestLogsFightsSelected: string[];
}

const initialState: PlanState = {
  encounterForm: {
    zoneId: Raids[0].id,
    encounterId: Raids[0].encounters[0].id,
    difficulty: DIFFICULTIES.MYTHIC_RAID,
  },
  filterCustomReportByEncouterId: true,
  customReportFightsSelected: [],
  bestLogsFightsSelected: [],
};

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    setEncounterForm: (state, action) => {
      state.encounterForm = { ...state.encounterForm, ...action.payload };
    },
    setFilterCustomReportByEncouterId: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.filterCustomReportByEncouterId = action.payload;
    },
    addCustomReportFightsSelected: (state, action) => {
      if (!state.customReportFightsSelected.includes(action.payload))
        state.customReportFightsSelected.push(action.payload);
    },
    toggleCustomReportFightsSelected: (
      state,
      action: PayloadAction<string[]>,
    ) => {
      action.payload.forEach((fightId) => {
        const index = state.customReportFightsSelected.indexOf(fightId);
        if (index === -1) state.customReportFightsSelected.push(fightId);
        else state.customReportFightsSelected.splice(index, 1);
      });
    },
    addBestLogsFightsSelected: (state, action: PayloadAction<string>) => {
      if (!state.bestLogsFightsSelected.includes(action.payload))
        state.bestLogsFightsSelected.push(action.payload);
    },
    toggleBestLogsFightsSelected: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((fightId) => {
        const index = state.bestLogsFightsSelected.indexOf(fightId);
        if (index === -1) state.bestLogsFightsSelected.push(fightId);
        else state.bestLogsFightsSelected.splice(index, 1);
      });
    },
    resetBestLogsFightsSelected: (state) => {
      state.bestLogsFightsSelected = [];
    },
  },
});

export const {
  setEncounterForm,
  setFilterCustomReportByEncouterId,
  addCustomReportFightsSelected,
  toggleCustomReportFightsSelected,
  addBestLogsFightsSelected,
  toggleBestLogsFightsSelected,
  resetBestLogsFightsSelected,
} = planSlice.actions;

export default planSlice;
