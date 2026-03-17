import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { opportunities, keywords, products } from '@/lib/db/schema';
import { eq, desc, gte, and } from 'drizzle-orm';
import { apiSuccess, apiError, handleApiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return apiError('Unauthorized', 401);
    }

    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type'); // niche, keyword, product, pricing
    const minScore = parseInt(searchParams.get('minScore') || '0');

    const whereCondition = type
      ? and(eq(opportunities.userId, userId), eq(opportunities.type, type))
      : eq(opportunities.userId, userId);

    const whereConditionWithScore = minScore > 0
      ? and(whereCondition, gte(opportunities.score, minScore))
      : whereCondition;

    const results = await db
      .select()
      .from(opportunities)
      .where(whereConditionWithScore)
      .orderBy(desc(opportunities.score))
      .limit(50);

    return apiSuccess({ opportunities: results });
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

    // Generate opportunities based on user's keywords and products
    const userKeywords = await db
      .select()
      .from(keywords)
      .where(eq(keywords.userId, userId))
      .orderBy(desc(keywords.opportunityScore))
      .limit(10);

    const generatedOpportunities = [];

    for (const keyword of userKeywords) {
      if ((keyword.opportunityScore ?? 0) > 70) {
        generatedOpportunities.push({
          userId,
          type: 'keyword',
          title: `High Opportunity: ${keyword.keyword}`,
          description: `This keyword has low competition (${keyword.competition}) and high search volume (${keyword.searchVolume})`,
          score: keyword.opportunityScore ?? 0,
          difficulty: keyword.competition ?? 'unknown',
          timeframe: 'short',
          data: {
            keyword: keyword.keyword,
            searchVolume: keyword.searchVolume ?? 0,
            competition: keyword.competition ?? 'unknown',
            cpc: keyword.cpc ?? 0,
          },
          actionItems: [
            'Create products targeting this keyword',
            'Optimize existing listings',
            'Run targeted ads',
          ],
        });
      }
    }

    if (generatedOpportunities.length > 0) {
      await db.insert(opportunities).values(generatedOpportunities);
    }

    return apiSuccess({
      generated: generatedOpportunities.length,
      opportunities: generatedOpportunities,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
