import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { savedSearches } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { apiSuccess, apiError, handleApiError } from '@/lib/utils/api-response';
import { z } from 'zod';

const savedSearchSchema = z.object({
  name: z.string().min(1).max(100),
  searchType: z.enum(['products', 'keywords', 'competitors', 'trends']),
  filters: z.record(z.any()),
  isScheduled: z.boolean().optional(),
  scheduleFrequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return apiError('Unauthorized', 401);
    }

    const results = await db
      .select()
      .from(savedSearches)
      .where(eq(savedSearches.userId, userId))
      .orderBy(desc(savedSearches.lastRunAt));

    return apiSuccess({ searches: results });
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

    const body = await req.json();
    const validation = savedSearchSchema.safeParse(body);
    
    if (!validation.success) {
      return apiError('Invalid request', 400, 'VALIDATION_ERROR', validation.error.errors);
    }

    const [search] = await db
      .insert(savedSearches)
      .values({
        userId,
        ...validation.data,
      })
      .returning();

    return apiSuccess(search, 'Search saved successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
