import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { apiKeys } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { apiSuccess, apiError, handleApiError } from '@/lib/utils/api-response';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return apiError('Unauthorized', 401);
    }

    await db
      .delete(apiKeys)
      .where(
        and(
          eq(apiKeys.id, params.id),
          eq(apiKeys.userId, userId)
        )
      );

    return apiSuccess({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
