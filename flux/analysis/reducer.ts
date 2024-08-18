import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AnalysisState {
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
  minimumFightDurationMinutes: number;
}

const initialState: AnalysisState = {
  excluded: {},
  excludedBulk: [],
  priority: {},
  minimumFightDurationMinutes: 1,
};

const analysisSlice = createSlice({
  name: 'analysis',
  initialState,
  reducers: {
    setMinimumFightDurationMinutes: (state, action: PayloadAction<number>) => {
      state.minimumFightDurationMinutes = action.payload;
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
  setMinimumFightDurationMinutes,
  setExcludedCharacters,
  setExcludedBulkCharacters,
  setPriorityCharacters,
  removeCharacterFromExcludedAndPriority,
} = analysisSlice.actions;

export default analysisSlice;
