import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { apiKeys } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { apiSuccess, apiError, handleApiError } from '@/lib/utils/api-response';
import { apiKeySchema } from '@/lib/utils/validators';
import { createHash, randomBytes } from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return apiError('Unauthorized', 401);
    }

    const keys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPreview: apiKeys.keyPreview,
        permissions: apiKeys.permissions,
        rateLimit: apiKeys.rateLimit,
        requestCount: apiKeys.requestCount,
        lastUsedAt: apiKeys.lastUsedAt,
        createdAt: apiKeys.createdAt,
        isActive: apiKeys.isActive,
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId));

    return apiSuccess(keys);
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
    const validation = apiKeySchema.safeParse(body);
    
    if (!validation.success) {
      return apiError('Invalid request', 400, 'VALIDATION_ERROR', validation.error.errors);
    }

    // Generate API key
    const key = `sk_${randomBytes(32).toString('hex')}`;
    const keyHash = createHash('sha256').update(key).digest('hex');
    const keyPreview = key.substring(0, 12);

    const payload = {
      userId,
      keyHash,
      keyPreview,
      ...validation.data,
    } as any;

    if (payload.expiresAt) {
      payload.expiresAt = new Date(payload.expiresAt);
    }

    const [apiKey] = await db
      .insert(apiKeys)
      .values(payload)
      .returning();

    return apiSuccess({
      ...apiKey,
      key, // Return full key only once
    }, 'API key created successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
