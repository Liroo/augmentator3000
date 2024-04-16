import { ThunkApiConfig, ThunkArg } from '@/types/thunk';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getApi } from '../api';
import { setCharacter } from './reducer';

export const getWCLCharacter = createAsyncThunk<
  void,
  { name: string; serverSlug: string; serverRegion: string } & ThunkArg,
  ThunkApiConfig
>(
  'wcl/getWCLCharacter',
  async ({ name, serverSlug, serverRegion }, { dispatch }) => {
    const { character } = await getApi(
      `/api/wcl/character?name=${name}&serverSlug=${serverSlug}&serverRegion=${serverRegion}`,
    );

    if (!!character)
      dispatch(
        setCharacter({
          ...character,
          serverSlug,
          serverRegion,
        }),
      );
  },
);
