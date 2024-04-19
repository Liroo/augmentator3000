import { useAppDispatch, useAppSelector } from '@/flux/hooks';
import { selectRosterListEnhanced } from '@/flux/roster/selector';
import {
  getWCLCharactersWithEncounterRankings,
  getWCLReports,
} from '@/flux/wcl/action';
import { WCLCharacter } from '@/wcl/wcl';

export default function useAugAnalyzer() {
  const dispatch = useAppDispatch();
  const rosterListEnhanced = useAppSelector(selectRosterListEnhanced);

  const analyzeByEncounterId = async (encounterID: number) => {
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
      const rank = c?.encounterRankings?.[encounterID]?.ranks?.[0];

      if (!rank) return acc;

      const existingRank = acc.find((r: any) => r.code === rank.report.code);
      if (existingRank) {
        existingRank.players.push({
          name: c.name,
          spec: rank.spec,
          class: rank.class,
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
            server: c.serverSlug,
          },
        ],
      });
      return acc;
    }, []);

    const reportsQuery = reportsToAnalyze.map((r) => {
      const timeRange: number[][] = [];
      for (let i = 3000; i < r.endTime - r.startTime; i += 30000) {
        timeRange.push([i, Math.min(i + 30000, r.endTime - r.startTime)]);
      }

      return {
        code: r.code,
        timeRanges: timeRange.map((tr) => ({
          startTime: r.startTime + tr[0],
          endTime: r.startTime + tr[1],
        })),
      };
    });

    const reports = await dispatch(getWCLReports({ reportsQuery })).unwrap();

    console.log(reportsToAnalyze, reports);
  };

  return { analyzeByEncounterId };
}
