import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { aiAnalyses } from '@/lib/db/schema';
import { eq, gte, sql } from 'drizzle-orm';
import { apiSuccess, apiError, handleApiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return apiError('Unauthorized', 401);
    }

    const searchParams = req.nextUrl.searchParams;
    const range = searchParams.get('range') || '30d';

    const now = new Date();
    const startDate = new Date();
    
    switch (range) {
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

    // Get all analyses for the user in time range
    const analyses = await db
      .select()
      .from(aiAnalyses)
      .where(
        sql`${aiAnalyses.userId} = ${userId} AND ${aiAnalyses.createdAt} >= ${startDate}` 
      );

    // Calculate stats
    const totalAnalyses = analyses.length;
    const totalCost = analyses.reduce((sum, a) => sum + (a.costUsd || 0), 0);
    const averageConfidence = analyses.reduce((sum, a) => sum + (a.confidence || 0), 0) / totalAnalyses || 0;

    // Group by type
    const byType = analyses.reduce((acc: any[], a) => {
      const existing = acc.find(item => item.type === a.analysisType);
      if (existing) {
        existing.count++;
        existing.totalCost += a.costUsd || 0;
        existing.totalTime += a.processingTimeMs || 0;
      } else {
        acc.push({
          type: a.analysisType,
          count: 1,
          totalCost: a.costUsd || 0,
          totalTime: a.processingTimeMs || 0,
        });
      }
      return acc;
    }, []);

    const formattedByType = byType.map(item => ({
      type: item.type,
      count: item.count,
      avgCost: item.totalCost / item.count,
      avgTime: item.totalTime / item.count,
    }));

    // Group by provider
    const byProvider = analyses.reduce((acc: any[], a) => {
      const existing = acc.find(item => item.provider === a.provider);
      if (existing) {
        existing.count++;
        existing.cost += a.costUsd || 0;
      } else {
        acc.push({
          provider: a.provider || 'unknown',
          count: 1,
          cost: a.costUsd || 0,
        });
      }
      return acc;
    }, []);

    return apiSuccess({
      totalAnalyses,
      totalCost,
      averageConfidence,
      byType: formattedByType,
      byProvider,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
