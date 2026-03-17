import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { competitors, users } from '@/lib/db/schema';
import { eq, desc, and, ilike, sql } from 'drizzle-orm';
import { apiSuccess, apiError, handleApiError } from '@/lib/utils/api-response';
import { competitorSchema } from '@/lib/utils/validators';
import { rateLimit } from '@/lib/utils/rate-limit';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return apiError('Unauthorized', 401);
    }

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    const offset = (page - 1) * limit;

    let query = db
      .select()
      .from(competitors)
      .where(eq(competitors.userId, userId));

    if (search) {
      query = query.where(ilike(competitors.name, `%${search}%`));
    }

    const results = await query
      .orderBy(desc(competitors.lastAnalyzedAt))
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(competitors)
      .where(eq(competitors.userId, userId));

    return apiSuccess({
      competitors: results,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return apiError('Unauthorized', 401);
    }

    const rateLimitResult = await rateLimit(`competitors:create:${userId}`, 30, 3600);
    if (!rateLimitResult.success) {
      return apiError('Rate limit exceeded', 429);
    }

    const body = await req.json();
    const validation = competitorSchema.safeParse(body);
    
    if (!validation.success) {
      return apiError('Invalid request', 400, 'VALIDATION_ERROR', validation.error.errors);
    }

    const [competitor] = await db
      .insert(competitors)
      .values({
        userId,
        ...validation.data,
        lastAnalyzedAt: new Date(),
      })
      .returning();

    return apiSuccess(competitor, 'Competitor added successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
