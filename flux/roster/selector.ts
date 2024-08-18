import { createSelector } from '@reduxjs/toolkit';
import { rosterCharacterToKey } from 'utils/key';
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
      })
      .filter((c) => !!c.WCLCharacter),
);
