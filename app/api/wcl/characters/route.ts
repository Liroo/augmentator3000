import { initWCLClient } from '@/wcl';
import { WCLGetCharacters } from '@/wcl/query/character';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const validation = z.object({
  encounterRankings: z.array(
    z.object({
      encounterID: z.number(),
      difficulty: z.number(),
      partition: z.number().optional(),
    }),
  ),
  characters: z.array(
    z.object({
      name: z.string(),
      serverSlug: z.string(),
      serverRegion: z.string(),
      specName: z.string().optional().default(''),
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

  const token = await getToken({
    req: request as NextRequest,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const WCLClient = await initWCLClient(token.accessToken as string);
  const charactersWithEncounterRankings = await WCLGetCharacters(
    WCLClient,
    characters,
    encounterRankings,
  );

  return Response.json({
    characters: Object.values(charactersWithEncounterRankings),
  });
}
