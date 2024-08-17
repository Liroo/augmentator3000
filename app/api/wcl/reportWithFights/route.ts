import { initWCLClient } from '@/wcl/client';
import { WCLGetReportWithFights } from '@/wcl/query/report';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const validation = z.object({
  code: z.string(),
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

  const { code } = queryResult.data;

  const WCLClient = await initWCLClient('');
  const reportWithFights = await WCLGetReportWithFights(WCLClient, code);

  return Response.json({
    ...reportWithFights,
  });
}
