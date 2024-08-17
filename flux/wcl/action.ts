import { ThunkApiConfig, ThunkArg } from '@/types/thunk';
import { WCLReport, WCLReportQuery } from '@/wcl/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { postApi } from '../api';
import {
  setCharacter,
  setCharacterEncounterRanking,
  setReport,
  setReportWithFights,
} from './reducer';

import {
  encounterRankingRankToKey,
  getDataFromEncouterRankingKey,
} from '@/utils/report';
import { WCLGetCharacter } from '@/wcl/query/character/getCharacter';
import { WCLGetCharactersEncounterRankings } from '@/wcl/query/character/getCharactersEncounterRankings';
import { WCLGetReportWithFights } from '@/wcl/query/report/getReportWithFights';
import WCLClient from 'services/wcl';
import { addBestLogsFightsSelected } from '../plan/reducer';
import { selectRosterInUseListWithWCLCharacter } from '../roster/selector';
import { selectWCLCharacterByInternalIdCharacterKey } from './selector';

export const getWCLCharacter = createAsyncThunk<
  void,
  { name: string; serverSlug: string; serverRegion: string } & ThunkArg,
  ThunkApiConfig
>(
  'wcl/getWCLCharacter',
  async ({ name, serverSlug, serverRegion }, { dispatch }) => {
    const character = await WCLGetCharacter(WCLClient.client, {
      name,
      serverSlug,
      serverRegion,
    });

    if (!!character) {
      dispatch(
        setCharacter({
          ...character,
          serverSlug,
          serverRegion,
        }),
      );
    }
  },
);

export const getWCLReportWithFights = createAsyncThunk<
  WCLReport,
  {
    code: string;
  } & ThunkArg,
  ThunkApiConfig
>('wcl/getWCLReportWithFights', async ({ code }, { dispatch }) => {
  const reportWithFights = await WCLGetReportWithFights(WCLClient.client, code);

  dispatch(setReportWithFights(reportWithFights));

  return reportWithFights;
});

export const getWCLCharactersEncounterRankings = createAsyncThunk<
  void,
  {
    encounterId: number;
    difficulty: number;
    partitions: number[];
  } & ThunkArg,
  ThunkApiConfig
>(
  'wcl/getWCLCharactersEncounterRankings',
  async ({ encounterId, difficulty, partitions }, { dispatch, getState }) => {
    const rosterList = selectRosterInUseListWithWCLCharacter(getState());
    if (!rosterList.length) return;

    const charactersWithEncounterRankings =
      await WCLGetCharactersEncounterRankings(
        WCLClient.client,
        rosterList.map((rosterCharacter) => rosterCharacter.rosterCharacter),
        encounterId,
        difficulty,
        partitions,
      );

    Object.entries(charactersWithEncounterRankings).forEach(
      ([key, encounterRankings]) => {
        dispatch(
          setCharacterEncounterRanking({
            characterKey: key,
            encounterRankings,
          }),
        );
        Object.entries(encounterRankings).forEach(
          ([encounterRankingsKey, encounterRanking]) => {
            const bestRank = [...encounterRanking.ranks].sort(
              (a, b) => b.amount - a.amount,
            )[0];
            const character =
              selectWCLCharacterByInternalIdCharacterKey(key)(getState());

            if (!bestRank || !character) return;

            const { partition } =
              getDataFromEncouterRankingKey(encounterRankingsKey);
            dispatch(
              addBestLogsFightsSelected(
                encounterRankingRankToKey(
                  character,
                  encounterId,
                  difficulty,
                  ~~partition,
                  bestRank,
                ),
              ),
            );
          },
        );
      },
    );
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
