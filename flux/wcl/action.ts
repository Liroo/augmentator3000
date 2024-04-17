import { ThunkApiConfig, ThunkArg } from '@/types/thunk';
import { WCLCharacterQueryWithSpec } from '@/wcl/wcl';
import { getSpecNameById } from '@/wow/class';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getApi, postApi } from '../api';
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

export const getWCLCharactersWithEncounterRankings = createAsyncThunk<
  void,
  {
    encounterId: string;
    characters: WCLCharacterQueryWithSpec[];
  } & ThunkArg,
  ThunkApiConfig
>(
  'wcl/getWCLCharactersWithEncounterRankings',
  async ({ encounterId, characters }, { dispatch }) => {
    const res = await postApi('/api/wcl/characters', {
      encounterRankings: [
        {
          encounterID: encounterId,
          difficulty: 5,
        },
      ],
      characters: characters.map((c) => ({
        name: c.name,
        serverSlug: c.serverSlug,
        serverRegion: c.serverRegion,
        specName: getSpecNameById(c.specID),
      })),
    });

    console.log(res);
  },
);
