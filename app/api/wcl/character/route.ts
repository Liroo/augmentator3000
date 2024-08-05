import { initWCLClient } from '@/wcl';
import { WCLGetCharacter } from '@/wcl/query/character';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const validation = z.object({
  name: z.string(),
  serverSlug: z.string(),
  serverRegion: z.string(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const queryResult = validation.safeParse(
    Object.fromEntries(searchParams.entries()),
  );

  if (!queryResult.success) {
    const { errors } = queryResult.error;

    return Response.json(
      {
        error: { message: 'Invalid request', errors },
      },
      { status: 400 },
    );
  }
  const { name, serverSlug, serverRegion } = queryResult.data;

  const token = await getToken({
    req: request as NextRequest,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const WCLClient = await initWCLClient(token.accessToken as string);
  const character = await WCLGetCharacter(WCLClient, {
    name,
    serverSlug,
    serverRegion,
  });

  return Response.json({
    character,
  });
}
