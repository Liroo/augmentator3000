import { useAppDispatch, useAppSelector } from '@/flux/hooks';
import {
  selectPlanEncounterForm,
  selectPlanTimeRangesByKey,
} from '@/flux/plan/selector';
import { selectRosterListEnhanced } from '@/flux/roster/selector';
import {
  getWCLCharactersWithEncounterRankings,
  getWCLReports,
} from '@/flux/wcl/action';
import { WCLCharacter, WCLReportQuery } from '@/wcl/wcl';

export default function useAugAnalyzer() {
  const dispatch = useAppDispatch();
  const rosterListEnhanced = useAppSelector(selectRosterListEnhanced);
  const { encounterID, timeRangesKey } = useAppSelector(
    selectPlanEncounterForm,
  );
  const timeRanges = useAppSelector(selectPlanTimeRangesByKey(timeRangesKey));

  const analyze = async () => {
    const charactersWithEncounterRankings = await dispatch(
      getWCLCharactersWithEncounterRankings({
        encounterID,
        characters: rosterListEnhanced,
      }),
    ).unwrap();

    const reportsToAnalyze: Array<{
      code: string;
      startTime: number;
      endTime: number;
      players: Array<{
        name: string;
        serverSlug: string;
        serverRegion: string;
      }>;
    }> = charactersWithEncounterRankings.reduce((acc: any, c: WCLCharacter) => {
      const addRankToAcc = (rank: any) => {
        const existingRank = acc.find((r: any) => r.code === rank.report.code);
        if (existingRank) {
          existingRank.players.push({
            name: c.name,
            serverSlug: c.serverSlug,
            serverRegion: c.serverRegion,
          });
          return acc;
        }

        acc.push({
          code: rank.report.code,
          startTime: rank.startTime - rank.report.startTime,
          endTime: rank.startTime - rank.report.startTime + rank.duration,
          players: [
            {
              name: c.name,
              serverSlug: c.serverSlug,
              serverRegion: c.serverRegion,
            },
          ],
        });
      };
      const rank0 = c?.encounterRankings?.[encounterID]?.ranks?.[0];
      const rank1 = c?.encounterRankings?.[encounterID]?.ranks?.[1];
      const rank2 = c?.encounterRankings?.[encounterID]?.ranks?.[2];

      if (rank0) addRankToAcc(rank0);
      if (rank1) addRankToAcc(rank1);
      if (rank2) addRankToAcc(rank2);

      return acc;
    }, []);

    const reportsQuery = reportsToAnalyze.map((r) => {
      return {
        code: r.code,
        startTime: r.startTime,
        timeRanges: timeRanges
          .reduce((acc: WCLReportQuery['timeRanges'], tr) => {
            // Increment 9s by 9s max to reduce margin of error in wow in case of EB time window failure or not exact
            for (let i = tr.startTime; i < tr.endTime; i += 9000) {
              acc = [
                ...acc,
                {
                  startTime: r.startTime + i + (i === tr.startTime ? 0 : 1), // Add a single ms to avoid overlap between time ranges
                  endTime: r.startTime + Math.min(i + 9000, tr.endTime),
                },
              ];
            }
            return acc;
          }, [])
          .filter((tr) => tr.startTime < r.endTime),
      };
    });

    dispatch(getWCLReports({ reportsQuery, encounterID }));
  };

  return { analyze };
}
