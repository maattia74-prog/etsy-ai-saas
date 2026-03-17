import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { competitors, users, aiAnalyses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getAIClient } from '@/lib/ai/client';
import { apiSuccess, apiError, handleApiError } from '@/lib/utils/api-response';
import { checkQuota } from '@/lib/utils/rate-limit';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return apiError('Unauthorized', 401);
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      return apiError('User not found', 404);
    }

    const hasQuota = await checkQuota(userId, user.apiQuotaUsed, user.apiQuotaLimit);
    if (!hasQuota) {
      return apiError('API quota exceeded', 429);
    }

    const [competitor] = await db
      .select()
      .from(competitors)
      .where(eq(competitors.id, params.id))
      .limit(1);

    if (!competitor || competitor.userId !== userId) {
      return apiError('Competitor not found', 404);
    }

    const aiClient = getAIClient();
    const startTime = Date.now();

    // Analyze competitor
    const analysis = await aiClient.analyzeCompetitor(
      {
        name: competitor.name,
        products: (competitor.topProducts as any) || [],
      },
      {
        userId,
        quotaUsed: user.apiQuotaUsed,
        quotaLimit: user.apiQuotaLimit,
        subscriptionTier: user.subscriptionTier as 'free' | 'pro' | 'enterprise',
      }
    );

    const processingTime = Date.now() - startTime;

    // Update competitor with analysis
    await db
      .update(competitors)
      .set({
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        analysisData: analysis,
        lastAnalyzedAt: new Date(),
      })
      .where(eq(competitors.id, params.id));

    // Log analysis
    await db.insert(aiAnalyses).values({
      userId,
      analysisType: 'competitor',
      inputData: { competitorId: params.id, competitorName: competitor.name },
      results: analysis,
      processingTimeMs: processingTime,
    });

    // Update quota
    await db
      .update(users)
      .set({ apiQuotaUsed: user.apiQuotaUsed + 1 })
      .where(eq(users.id, userId));

    return apiSuccess({
      ...analysis,
      processingTimeMs: processingTime,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
