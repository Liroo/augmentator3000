import { WCLCharacter } from '@/wcl/wcl';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WCLState {
  characters: {
    [canonicalID: string]: WCLCharacter;
  };
}

const initialState: WCLState = {
  characters: {},
};

const wclSlice = createSlice({
  name: 'wcl',
  initialState,
  reducers: {
    setCharacter: (state, action: PayloadAction<WCLCharacter>) => {
      state.characters[action.payload.canonicalID as string] = action.payload;
    },
  },
});

export const { setCharacter } = wclSlice.actions;

export default wclSlice;
