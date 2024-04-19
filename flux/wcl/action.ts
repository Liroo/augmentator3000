import { ThunkApiConfig, ThunkArg } from '@/types/thunk';
import {
  WCLCharacter,
  WCLCharacterQueryWithSpec,
  WCLReport,
  WCLReportQuery,
} from '@/wcl/wcl';
import { getSpecNameById } from '@/wow/class';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getApi, postApi } from '../api';
import { setCharacter, setCharacters, setReport } from './reducer';

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
  WCLCharacter[],
  {
    encounterID: number;
    characters: WCLCharacterQueryWithSpec[];
  } & ThunkArg,
  ThunkApiConfig
>(
  'wcl/getWCLCharactersWithEncounterRankings',
  async ({ encounterID, characters }, { dispatch }) => {
    const { characters: charactersWithEncounterRankings } = await postApi(
      '/api/wcl/characters',
      {
        encounterRankings: [
          {
            encounterID,
            difficulty: 5,
          },
        ],
        characters: characters.map((c) => ({
          name: c.name,
          serverSlug: c.serverSlug,
          serverRegion: c.serverRegion,
          specName: getSpecNameById(c.specID),
        })),
      },
    );

    dispatch(setCharacters(charactersWithEncounterRankings));

    return charactersWithEncounterRankings;
  },
);

export const getWCLReport = createAsyncThunk<
  WCLReport,
  {
    reportQuery: WCLReportQuery;
  } & ThunkArg,
  ThunkApiConfig
>('wcl/getWCLReport', async ({ reportQuery }, { dispatch }) => {
  const report = await postApi('/api/wcl/report', {
    code: reportQuery.code,
    timeRanges: reportQuery.timeRanges,
  });

  dispatch(setReport(report));

  return report as WCLReport;
});

export const getWCLReports = createAsyncThunk<
  WCLReport[],
  {
    reportsQuery: WCLReportQuery[];
  } & ThunkArg,
  ThunkApiConfig
>('wcl/getWCLReports', async ({ reportsQuery }, { dispatch }) => {
  const promiseArray = reportsQuery.map((reportQuery) => {
    return dispatch(getWCLReport({ reportQuery })).unwrap();
  });
  const results = Promise.all(promiseArray);

  return results;
});
