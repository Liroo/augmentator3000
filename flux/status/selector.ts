import { createSelector } from 'reselect';

import { RootState } from 'flux/store';
import { StatusEnum } from './reducer';

const idleStatus = {
  status: StatusEnum.Idle,
  error: null,
};

const selectStatusReducer = (state: RootState) => state.status;

export const selectStatusByActionTypeId = (
  actionType: string,
  id: string = 'default',
) =>
  createSelector(
    [selectStatusReducer],
    (statusReducer) => statusReducer[actionType]?.[id] ?? idleStatus,
  );

export const selectStatusByActionTypeIsLoading = (actionType: string) =>
  createSelector([selectStatusReducer], (statusReducer) => {
    return Object.keys(statusReducer[actionType] ?? []).some(
      (key) => statusReducer[actionType][key].status === StatusEnum.Pending,
    );
  });
