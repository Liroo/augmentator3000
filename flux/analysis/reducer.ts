import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AnalysisState {
  excluded: {
    // key in form of region-encounterId-difficulty-index
    [key: string]: string[];
  };
  excludedBulk: string[];
  minimumFightDurationMinutes: number;
}

const initialState: AnalysisState = {
  excluded: {},
  excludedBulk: [],
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
  },
});

export const {
  setMinimumFightDurationMinutes,
  setExcludedCharacters,
  setExcludedBulkCharacters,
} = analysisSlice.actions;

export default analysisSlice;
