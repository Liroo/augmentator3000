import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Region } from 'game/regions';
import {
  WCLCharacter,
  WCLCharacterEncounterRanking,
  WCLReport,
} from 'services/wcl/types';
import { rosterCharacterToKey } from 'utils/roster';

export interface WCLState {
  region: Region;
  characters: {
    [characterKey: string]: WCLCharacter;
  };
  reportWithFights: {
    [code: string]: WCLReport;
  };
}

const initialState: WCLState = {
  region: 'EU',
  characters: {},
  reportWithFights: {},
};

const wclSlice = createSlice({
  name: 'wcl',
  initialState,
  reducers: {
    setRegion: (state, action: PayloadAction<Region>) => {
      state.region = action.payload;
    },
    setCharacter: (state, action: PayloadAction<WCLCharacter>) => {
      state.characters[rosterCharacterToKey(action.payload)] = action.payload;
    },
    setCharacterEncounterRanking: (
      state,
      action: PayloadAction<{
        characterKey: string;
        encounterRankings: {
          [rosterCharacterKey: string]: WCLCharacterEncounterRanking;
        };
      }>,
    ) => {
      const { characterKey, encounterRankings } = action.payload;
      if (!state.characters[characterKey]) return;
      if (!state.characters[characterKey].encounterRankings)
        state.characters[characterKey].encounterRankings = {};

      state.characters[characterKey].encounterRankings = {
        ...state.characters[characterKey].encounterRankings,
        ...encounterRankings,
      };
    },
    setReportWithFights: (state, action: PayloadAction<WCLReport>) => {
      state.reportWithFights[action.payload.code] = action.payload;
    },
    removeReportWithFight: (state, action: PayloadAction<string>) => {
      delete state.reportWithFights[action.payload];
    },
    resetEncounterRankings: (state) => {
      Object.values(state.characters).forEach((character) => {
        character.encounterRankings = {};
      });
    },
  },
});

export const {
  setRegion,
  setCharacter,
  setCharacterEncounterRanking,
  setReportWithFights,
  removeReportWithFight,
  resetEncounterRankings,
} = wclSlice.actions;

export default wclSlice;
