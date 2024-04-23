import { WCLCharacter, WCLReport } from '@/wcl/wcl';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WCLState {
  characters: {
    [canonicalID: string]: WCLCharacter;
  };
  reports: {
    [code: string]: WCLReport;
  };
}

const initialState: WCLState = {
  characters: {},
  reports: {},
};

const wclSlice = createSlice({
  name: 'wcl',
  initialState,
  reducers: {
    setCharacter: (state, action: PayloadAction<WCLCharacter>) => {
      state.characters[action.payload.canonicalID as string] = action.payload;
    },
    setCharacters: (state, action: PayloadAction<WCLCharacter[]>) => {
      action.payload.forEach((character) => {
        state.characters[character.canonicalID as string] = character;
      });
    },
    setReport: (state, action: PayloadAction<WCLReport>) => {
      state.reports[
        `${action.payload.code}-${action.payload.associatedEncounterID}`
      ] = action.payload;
    },
  },
});

export const { setCharacter, setCharacters, setReport } = wclSlice.actions;

export default wclSlice;
