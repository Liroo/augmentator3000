import { initWCLClient } from '@/wcl';
import { WCLGetReportTableDamage } from '@/wcl/query/report';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const validation = z.object({
  code: z.string(),
  timeRanges: z.array(
    z.object({
      startTime: z.number(),
      endTime: z.number(),
    }),
  ),
  filterExpression: z.string().optional().default(''),
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

  const { code, timeRanges, filterExpression } = queryResult.data;

  const WCLClient = await initWCLClient('');
  const reportTableDamage = await WCLGetReportTableDamage(
    WCLClient,
    code,
    timeRanges,
    filterExpression,
  );

  return Response.json({
    ...reportTableDamage,
  });
}
