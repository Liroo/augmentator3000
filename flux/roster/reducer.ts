import { WCLCharacterQuery, WCLCharacterQueryWithSpec } from '@/wcl/wcl';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RosterState {
  list: WCLCharacterQueryWithSpec[];
}

const initialState: RosterState = {
  list: [],
};

const rosterSlice = createSlice({
  name: 'roster',
  initialState,
  reducers: {
    rosterAddCharacter: (state, action) => {
      const exists = state.list.find(
        (c) =>
          c.name.toLowerCase() === action.payload.name.toLowerCase() &&
          c.serverSlug === action.payload.serverSlug &&
          c.serverRegion === action.payload.serverRegion,
      );
      if (exists) return;
      state.list.push(action.payload);
    },
    rosterModifyCharacter: (
      state,
      action: PayloadAction<{
        query: WCLCharacterQuery;
        character: WCLCharacterQueryWithSpec;
      }>,
    ) => {
      const index = state.list.findIndex(
        (c) =>
          c.name.toLowerCase() === action.payload.query.name.toLowerCase() &&
          c.serverSlug === action.payload.query.serverSlug &&
          c.serverRegion === action.payload.query.serverRegion,
      );
      if (index === -1) return;
      state.list[index] = action.payload.character;
    },
    rosterRemoveCharacter: (
      state,
      action: PayloadAction<WCLCharacterQuery>,
    ) => {
      state.list = state.list.filter(
        (c) =>
          c.name.toLowerCase() !== action.payload.name.toLowerCase() ||
          c.serverSlug !== action.payload.serverSlug ||
          c.serverRegion !== action.payload.serverRegion,
      );
    },
  },
});

export const {
  rosterAddCharacter,
  rosterModifyCharacter,
  rosterRemoveCharacter,
} = rosterSlice.actions;

export default rosterSlice;
