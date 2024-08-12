import { initWCLClient } from '@/wcl';
import { WCLGetCharacter } from '@/wcl/query/character';
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

  const WCLClient = await initWCLClient('');
  const character = await WCLGetCharacter(WCLClient, {
    name,
    serverSlug,
    serverRegion,
  });

  return Response.json({
    character,
  });
}
