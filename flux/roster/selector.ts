import { rosterCharacterToKey } from '@/utils/roster';
import { WCLCharacter } from '@/wcl/types';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { selectWCLRegion } from '../wcl/selector';

const selectRosterState = (state: RootState) => state.roster;
const selectWCLState = (state: RootState) => state.wcl;

export const selectRosterList = createSelector(
  [selectRosterState, selectWCLRegion],
  (rosterState, region) =>
    rosterState.list.filter((c) => c.serverRegion === region),
);

export const selectRosterListCount = createSelector(
  [selectRosterList],
  (rosterList) => ({
    total: rosterList.length,
    inUse: rosterList.filter((rosterCharacter) => rosterCharacter.use).length,
  }),
);

export const selectRosterListEnhanced = (filterUse: boolean = false) =>
  createSelector([selectRosterList, selectWCLState], (rosterList, wclState) =>
    rosterList
      .map((characterDetails) => {
        const character = Object.values(wclState.characters).find(
          (c) =>
            rosterCharacterToKey(c) === rosterCharacterToKey(characterDetails),
        );
        return {
          ...characterDetails,
          ...character,
        } as WCLCharacter;
      })
      .filter((c) => !filterUse || c.use),
  );

export const selectRosterListWithWCLCharacter = createSelector(
  [selectRosterList, selectWCLState],
  (rosterList, wclState) =>
    rosterList.map((rosterCharacter) => {
      const WCLCharacter = Object.values(wclState.characters).find(
        (c) =>
          rosterCharacterToKey(c) === rosterCharacterToKey(rosterCharacter),
      );
      return {
        rosterCharacter,
        WCLCharacter,
      };
    }),
);

export const selectRosterInUseListWithWCLCharacter = createSelector(
  [selectRosterList, selectWCLState],
  (rosterList, wclState) =>
    rosterList
      .filter((rosterCharacter) => rosterCharacter.use)
      .map((rosterCharacter) => {
        const WCLCharacter = Object.values(wclState.characters).find(
          (c) =>
            rosterCharacterToKey(c) === rosterCharacterToKey(rosterCharacter),
        );
        return {
          rosterCharacter,
          WCLCharacter,
        };
      }),
);
