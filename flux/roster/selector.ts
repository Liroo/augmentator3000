import { WCLCharacter } from '@/wcl/wcl';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const selectRosterState = (state: RootState) => state.roster;
const selectWCLState = (state: RootState) => state.wcl;

export const selectRosterList = createSelector(
  [selectRosterState],
  (rosterState) => rosterState.list,
);

export const selectRosterListEnhanced = createSelector(
  [selectRosterState, selectWCLState],
  (rosterState, wclState) =>
    rosterState.list.map((characterDetails) => {
      const character = Object.values(wclState.characters).find(
        (c) =>
          c.name === characterDetails.name &&
          c.serverSlug === characterDetails.serverSlug &&
          c.serverRegion === characterDetails.serverRegion,
      );
      return {
        ...characterDetails,
        ...character,
      } as WCLCharacter;
    }),
);
