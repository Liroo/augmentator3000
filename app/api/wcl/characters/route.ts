import { initWCLClient } from '@/wcl';
import { WCLGetCharacters } from '@/wcl/query/character';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const validation = z.object({
  encounterRankings: z.array(
    z.object({
      encounterID: z.number(),
      difficulty: z.number(),
    }),
  ),
  characters: z.array(
    z.object({
      name: z.string(),
      serverSlug: z.string(),
      serverRegion: z.string(),
      specName: z.string().optional(),
    }),
  ),
});

export async function POST(request: Request) {
  const body = await request.json();

  const queryResult = validation.safeParse(body);

  if (!queryResult.success) {
    const { errors } = queryResult.error;

    return Response.json(
      {
        error: { message: 'Invalid request', errors },
      },
      { status: 400 },
    );
  }

  const { characters, encounterRankings } = queryResult.data;

  const WCLClient = await initWCLClient();
  const charactersWithEncounterRankings = await WCLGetCharacters(
    WCLClient,
    characters,
    encounterRankings,
  );

  return Response.json({
    characters: charactersWithEncounterRankings,
  });
}
