import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TimeRange } from 'utils/analysis';
import {
  analysisSetupToKey,
  getDataFromAnalysisSetup,
  getDataFromEncounterKey,
} from 'utils/key';

export interface CustomEbonMightState {
  timeRanges: {
    [key: string]: TimeRange[];
  };
  excluded: {
    // key in form of region-encounterId-difficulty-index
    [key: string]: string[];
  };
  excludedBulk: string[];
  priority: {
    // key in form of region-encounterId-difficulty-index
    // value will be an array of string with a length of 6
    [key: string]: (string | null)[];
  };
}

const initialState: CustomEbonMightState = {
  timeRanges: {},
  excluded: {},
  excludedBulk: [],
  priority: {},
};

const customEbonMigthSlice = createSlice({
  name: 'customEbongMight',
  initialState,
  reducers: {
    setTimeRange: (
      state,
      action: PayloadAction<{ key: string; timeRange: TimeRange }>,
    ) => {
      if (!state.timeRanges[action.payload.key])
        state.timeRanges[action.payload.key] = [];
      state.timeRanges[action.payload.key].push(action.payload.timeRange);
    },
    removeTimeRange: (
      state,
      action: PayloadAction<{ key: string; index: number }>,
    ) => {
      state.timeRanges[action.payload.key].splice(action.payload.index, 1);
      const encounterData = getDataFromEncounterKey(action.payload.key);

      // move excluded and priority one index higher
      Object.keys(state.excluded).forEach((key) => {
        const { region, encounterId, difficulty, index } =
          getDataFromAnalysisSetup(key);

        if (
          encounterData.encounterId !== encounterId ||
          encounterData.difficulty !== difficulty
        )
          return;

        if (index > action.payload.index) {
          state.excluded[
            analysisSetupToKey(region, encounterId, difficulty, index)
          ] = state.excluded[key];
          delete state.excluded[key];
        }
      });
      Object.keys(state.priority).forEach((key) => {
        const { region, encounterId, difficulty, index } =
          getDataFromAnalysisSetup(key);

        if (
          encounterData.encounterId !== encounterId ||
          encounterData.difficulty !== difficulty
        )
          return;

        if (index > action.payload.index) {
          state.priority[
            analysisSetupToKey(region, encounterId, difficulty, index)
          ] = state.priority[key];
          delete state.priority[key];
        }
      });
    },
    setExcludedCharacters: (
      state,
      action: PayloadAction<{ key: string; characters: string[] }>,
    ) => {
      state.excluded[action.payload.key] = action.payload.characters;
    },
    setExcludedBulkCharacters: (state, action: PayloadAction<string[]>) => {
      state.excludedBulk = action.payload;
    },
    setPriorityCharacters: (
      state,
      action: PayloadAction<{ key: string; characters: (string | null)[] }>,
    ) => {
      state.priority[action.payload.key] = action.payload.characters;
    },
    removeCharacterFromExcludedAndPriority: (
      state,
      action: PayloadAction<string>,
    ) => {
      Object.keys(state.excluded).forEach((key) => {
        state.excluded[key] = state.excluded[key].filter(
          (character) => character !== action.payload,
        );
      });
      Object.keys(state.priority).forEach((key) => {
        state.priority[key] = state.priority[key].map((character) =>
          character === action.payload ? '' : character,
        );
      });
    },
  },
});

export const {
  setTimeRange,
  removeTimeRange,
  setExcludedCharacters,
  setExcludedBulkCharacters,
  setPriorityCharacters,
  removeCharacterFromExcludedAndPriority,
} = customEbonMigthSlice.actions;

export default customEbonMigthSlice;
