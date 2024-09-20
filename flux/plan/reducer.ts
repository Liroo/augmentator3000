import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RosterCharacter } from 'flux/roster/types';
import DIFFICULTIES from 'game/difficulties';
import { Raids } from 'game/raids';
import { rosterCharacterToKey } from 'utils/key';

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
    addCustomReportFightsSelected: (state, action: PayloadAction<string[]>) => {
      action.payload.forEach((fightId) => {
        if (!state.customReportFightsSelected.includes(fightId))
          state.customReportFightsSelected.push(fightId);
      });
    },
    removeCustomReportFightsSelected: (
      state,
      action: PayloadAction<string[]>,
    ) => {
      state.customReportFightsSelected =
        state.customReportFightsSelected.filter(
          (fightId) => !action.payload.includes(fightId),
        );
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
    removeBestLogsFightsSelectedForCharacter: (
      state,
      action: PayloadAction<RosterCharacter>,
    ) => {
      state.bestLogsFightsSelected = state.bestLogsFightsSelected.filter(
        (fightId) => fightId.startsWith(rosterCharacterToKey(action.payload)),
      );
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
  removeCustomReportFightsSelected,
  toggleCustomReportFightsSelected,
  addBestLogsFightsSelected,
  toggleBestLogsFightsSelected,
  resetBestLogsFightsSelected,
  removeBestLogsFightsSelectedForCharacter,
} = planSlice.actions;

export default planSlice;
