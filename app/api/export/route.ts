import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { products, keywords, competitors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { apiError, handleApiError } from '@/lib/utils/api-response';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return apiError('Unauthorized', 401);
    }

    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type'); // products, keywords, competitors
    const format = searchParams.get('format') || 'json'; // json, csv

    let data: any[] = [];

    switch (type) {
      case 'products':
        data = await db.select().from(products).where(eq(products.userId, userId));
        break;
      case 'keywords':
        data = await db.select().from(keywords).where(eq(keywords.userId, userId));
        break;
      case 'competitors':
        data = await db.select().from(competitors).where(eq(competitors.userId, userId));
        break;
      default:
        return apiError('Invalid export type', 400);
    }

    if (format === 'csv') {
      const csv = convertToCSV(data);
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${type}-export-${Date.now()}.csv"`,
        },
      });
    }

    return new Response(JSON.stringify(data, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${type}-export-${Date.now()}.json"`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}
