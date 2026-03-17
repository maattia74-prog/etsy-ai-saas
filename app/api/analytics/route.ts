import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { analytics, products, keywords, aiAnalyses } from '@/lib/db/schema';
import { eq, gte, count, sql, desc } from 'drizzle-orm';
import { apiSuccess, apiError, handleApiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return apiError('Unauthorized', 401);
    }

    const searchParams = req.nextUrl.searchParams;
    const timeRange = searchParams.get('range') || '7d'; // 7d, 30d, 90d, 1y

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Feature usage analytics
    const featureUsage = await db
      .select({
        feature: analytics.featureName,
        count: count(),
      })
      .from(analytics)
      .where(
        sql`${analytics.userId} = ${userId} AND ${analytics.createdAt} >= ${startDate}` 
      )
      .groupBy(analytics.featureName)
      .orderBy(desc(count()));

    // AI analysis types
    const aiUsage = await db
      .select({
        type: aiAnalyses.analysisType,
        count: count(),
        avgCost: sql<number>`AVG(${aiAnalyses.costUsd})`,
        avgTime: sql<number>`AVG(${aiAnalyses.processingTimeMs})`,
      })
      .from(aiAnalyses)
      .where(
        sql`${aiAnalyses.userId} = ${userId} AND ${aiAnalyses.createdAt} >= ${startDate}` 
      )
      .groupBy(aiAnalyses.analysisType);

    // Daily activity
    const dailyActivity = await db
      .select({
        date: sql<string>`DATE(${analytics.createdAt})`,
        count: count(),
      })
      .from(analytics)
      .where(
        sql`${analytics.userId} = ${userId} AND ${analytics.createdAt} >= ${startDate}` 
      )
      .groupBy(sql`DATE(${analytics.createdAt})`)
      .orderBy(sql`DATE(${analytics.createdAt})`);

    // Total products tracked over time
    const productsOverTime = await db
      .select({
        date: sql<string>`DATE(${products.createdAt})`,
        count: count(),
      })
      .from(products)
      .where(
        sql`${products.userId} = ${userId} AND ${products.createdAt} >= ${startDate}` 
      )
      .groupBy(sql`DATE(${products.createdAt})`)
      .orderBy(sql`DATE(${products.createdAt})`);

    return apiSuccess({
      timeRange,
      featureUsage,
      aiUsage,
      dailyActivity,
      productsOverTime,
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

    const body = await req.json();
    const { featureName, action, metadata, durationMs, success, errorMessage } = body;

    await db.insert(analytics).values({
      userId,
      featureName,
      action,
      metadata,
      durationMs,
      success: success !== false,
      errorMessage,
    });

    return apiSuccess({ logged: true });
  } catch (error) {
    return handleApiError(error);
  }
}
