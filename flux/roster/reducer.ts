import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WCLCharacterQuery } from 'services/wcl/types';
import { rosterCharacterToKey } from 'utils/roster';
import { RosterCharacter, RosterCharacterQuery } from './types';

export interface RosterState {
  list: RosterCharacter[];
}

const initialState: RosterState = {
  list: [],
};

const rosterSlice = createSlice({
  name: 'roster',
  initialState,
  reducers: {
    rosterAddCharacter: (
      state,
      action: PayloadAction<RosterCharacterQuery>,
    ) => {
      const exists = state.list.find(
        (c) => rosterCharacterToKey(c) === rosterCharacterToKey(action.payload),
      );
      if (exists) return;
      state.list.push({ ...action.payload, use: true });
    },
    rosterModifyCharacter: (
      state,
      action: PayloadAction<{
        query: RosterCharacterQuery;
        character: RosterCharacter;
      }>,
    ) => {
      const index = state.list.findIndex(
        (c) =>
          rosterCharacterToKey(c) ===
          rosterCharacterToKey(action.payload.query),
      );
      if (index === -1) return;
      state.list[index] = action.payload.character;
    },
    rosterRemoveCharacter: (
      state,
      action: PayloadAction<WCLCharacterQuery>,
    ) => {
      state.list = state.list.filter(
        (c) => rosterCharacterToKey(c) !== rosterCharacterToKey(action.payload),
      );
    },
    rosterReset: (state) => {
      state.list = [];
    },
    rosterToggleCharacterUse: (
      state,
      action: PayloadAction<RosterCharacterQuery>,
    ) => {
      const index = state.list.findIndex(
        (c) => rosterCharacterToKey(c) === rosterCharacterToKey(action.payload),
      );
      if (index === -1) return;
      state.list[index].use = !state.list[index].use;
    },
  },
});

export const {
  rosterAddCharacter,
  rosterModifyCharacter,
  rosterRemoveCharacter,
  rosterReset,
  rosterToggleCharacterUse,
} = rosterSlice.actions;

export default rosterSlice;
