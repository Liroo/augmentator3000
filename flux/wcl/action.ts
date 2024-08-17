import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkApiConfig, ThunkArg } from 'flux/types';
import { WCLReport } from 'wcl/types';
import {
  setCharacter,
  setCharacterEncounterRanking,
  setReportWithFights,
} from './reducer';

import WCLClient from 'services/wcl';
import {
  encounterRankingRankToKey,
  getDataFromEncouterRankingKey,
} from 'utils/report';
import { WCLGetCharacter } from 'wcl/query/character/getCharacter';
import { WCLGetCharactersEncounterRankings } from 'wcl/query/character/getCharactersEncounterRankings';
import { WCLGetReportWithFights } from 'wcl/query/report/getReportWithFights';
import { addBestLogsFightsSelected } from '../plan/reducer';
import { selectRosterInUseListWithWCLCharacter } from '../roster/selector';
import { selectWCLCharacterByCharacterKey } from './selector';

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
            const character = selectWCLCharacterByCharacterKey(key)(getState());

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
