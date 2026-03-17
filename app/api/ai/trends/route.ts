import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { users, aiAnalyses, trends } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getAIClient } from '@/lib/ai/client';
import { apiSuccess, apiError, handleApiError } from '@/lib/utils/api-response';
import { rateLimit, checkQuota } from '@/lib/utils/rate-limit';
import { z } from 'zod';

const requestSchema = z.object({
  keyword: z.string().min(1).max(200),
  historicalData: z.array(
    z.object({
      date: z.string(),
      searches: z.number(),
      sales: z.number(),
    })
  ).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return apiError('Unauthorized', 401);
    }

    const rateLimitResult = await rateLimit(`ai:trends:${userId}`, 20, 3600);
    if (!rateLimitResult.success) {
      return apiError('Rate limit exceeded', 429);
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      return apiError('User not found', 404);
    }

    const hasQuota = await checkQuota(userId, user.apiQuotaUsed, user.apiQuotaLimit);
    if (!hasQuota) {
      return apiError('API quota exceeded', 429);
    }

    const body = await req.json();
    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      return apiError('Invalid request', 400, 'VALIDATION_ERROR', validation.error.errors);
    }

    const { keyword, historicalData } = validation.data;

    // Generate mock historical data if not provided
    const mockData = historicalData || generateMockTrendData(keyword);

    const aiClient = getAIClient();
    const startTime = Date.now();

    const prediction = await aiClient.predictTrends(keyword, mockData, {
      userId,
      quotaUsed: user.apiQuotaUsed,
      quotaLimit: user.apiQuotaLimit,
      subscriptionTier: user.subscriptionTier as 'free' | 'pro' | 'enterprise',
    });

    const processingTime = Date.now() - startTime;

    // Store trend
    await db.insert(trends).values({
      category: 'etsy',
      keyword,
      trendData: mockData,
      prediction: {
        direction: prediction.prediction,
        growthRate: prediction.growthRate,
        peakMonths: prediction.peakMonths,
      },
      confidence: prediction.confidence,
      growthRate: prediction.growthRate,
      seasonality: prediction.peakMonths.length > 2 ? 'high' : 'low',
      peakMonths: prediction.peakMonths,
      analysisSource: 'ai',
    });

    // Log analysis
    await db.insert(aiAnalyses).values({
      userId,
      analysisType: 'trend',
      inputData: { keyword, dataPoints: mockData.length },
      results: prediction,
      confidence: prediction.confidence,
      processingTimeMs: processingTime,
    });

    // Update quota
    await db
      .update(users)
      .set({ apiQuotaUsed: user.apiQuotaUsed + 1 })
      .where(eq(users.id, userId));

    return apiSuccess({
      keyword,
      ...prediction,
      historicalData: mockData,
      processingTimeMs: processingTime,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

function generateMockTrendData(keyword: string) {
  const data = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    
    // Generate realistic trend data with seasonality
    const month = date.getMonth();
    const seasonalFactor = Math.sin((month / 12) * Math.PI * 2) * 0.3 + 1;
    const baseSearches = 1000 + Math.random() * 500;
    const baseSales = 100 + Math.random() * 50;
    
    data.push({
      date: date.toISOString().split('T')[0],
      searches: Math.round(baseSearches * seasonalFactor),
      sales: Math.round(baseSales * seasonalFactor),
    });
  }
  
  return data;
}
