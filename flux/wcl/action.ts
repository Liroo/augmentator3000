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
    encounterID: number;
  } & ThunkArg,
  ThunkApiConfig
>('wcl/getWCLReport', async ({ reportQuery, encounterID }, { dispatch }) => {
  const report = await postApi('/api/wcl/report', {
    code: reportQuery.code,
    timeRanges: reportQuery.timeRanges,
    filterExpression:
      'ability.id NOT IN (409632, 402583, 408682, 408694, 401324, 401306, 401422, 401428, 418774, 418588, 419591, 418607, 406251, 406889, 379403, 408791, 378426, 381006, 381700, 406764, 394453, 370794, 408836, 408815, 381475, 281721, 214397, 408469, 374087, 370817, 426564, 417458, 424965, 425181, 419737, 265953, 425154, 425156, 422146, 426341, 426431, 426486, 426339, 426527, 426535, 426306, 259756, 426288, 427209, 422956, 427161, 424324, 419279, 215444, 214168, 214169, 228784, 214350, 422750, 425701, 422750, 425461, 417458, 215407, 270827, 213785, 425509, 414532, 417134, 413584, 424094, 386301, 243991, 426297, 425610)',
  });

  dispatch(
    setReport({
      ...report,
      associatedEncounterID: encounterID,
      startTime: reportQuery.startTime,
    }),
  );

  return report as WCLReport;
});

export const getWCLReports = createAsyncThunk<
  WCLReport[],
  {
    reportsQuery: WCLReportQuery[];
    encounterID: number;
  } & ThunkArg,
  ThunkApiConfig
>('wcl/getWCLReports', async ({ reportsQuery, encounterID }, { dispatch }) => {
  const promiseArray = reportsQuery.map((reportQuery) => {
    return dispatch(getWCLReport({ reportQuery, encounterID })).unwrap();
  });
  const results = Promise.all(promiseArray);

  return results;
});
