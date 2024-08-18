import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Region } from 'game/regions';
import {
  WCLCharacter,
  WCLCharacterEncounterRanking,
  WCLReport,
  WCLReportFight,
} from 'services/wcl/types';
import { rosterCharacterToKey } from 'utils/key';

export interface WCLState {
  region: Region;
  characters: {
    [characterKey: string]: WCLCharacter;
  };
  reportWithFights: {
    [code: string]: WCLReport;
  };

  reportWithDamageTable: {
    [key: string]: WCLReport;
  };
}

const initialState: WCLState = {
  region: 'EU',
  characters: {},
  reportWithFights: {},
  reportWithDamageTable: {},
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
    setReportWithDamageTable: (
      state,
      action: PayloadAction<{ key: string; report: WCLReport }>,
    ) => {
      state.reportWithDamageTable[action.payload.key] = action.payload.report;
    },
    resetReportWithDamageTableByEncounterIdAndDifficulty: (
      state,
      action: PayloadAction<{
        encounterId: number;
        difficulty: number;
      }>,
    ) => {
      Object.entries(state.reportWithDamageTable).forEach(([key, report]) => {
        if (
          (report.fights as WCLReportFight[]).some(
            (fight) =>
              fight.encounterID === action.payload.encounterId &&
              fight.difficulty === action.payload.difficulty,
          )
        )
          delete state.reportWithDamageTable[key];
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
  setReportWithDamageTable,
  resetReportWithDamageTableByEncounterIdAndDifficulty,
} = wclSlice.actions;

export default wclSlice;
