import { Region } from '@/game/regions';
import { rosterCharacterToKey } from '@/utils/roster';
import {
  WCLCharacter,
  WCLCharacterEncounterRanking,
  WCLReport,
} from '@/wcl/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WCLState {
  region: Region;
  characters: {
    [internalId: string]: WCLCharacter;
  };
  reports: {
    [code: string]: WCLReport;
  };

  reportWithFights: {
    [code: string]: WCLReport;
  };
}

const initialState: WCLState = {
  region: 'EU',
  characters: {},
  reports: {},
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

    setReport: (state, action: PayloadAction<WCLReport>) => {
      state.reports[
        `${action.payload.code}-${action.payload.associatedEncounterID}-${action.payload.startTime}`
      ] = action.payload;
    },
    resetReports: (state) => {
      state.reports = {};
    },
  },
});

export const {
  setRegion,
  setCharacter,
  setCharacterEncounterRanking,
  setReport,
  setReportWithFights,
  removeReportWithFight,
  resetReports,
  resetEncounterRankings,
} = wclSlice.actions;

export default wclSlice;
