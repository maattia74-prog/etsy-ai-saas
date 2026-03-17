import { NextResponse } from 'next/server';

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

export function apiSuccess<T>(data: T, message?: string): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  });
}

export function apiError(
  error: string,
  status: number = 400,
  code?: string,
  details?: any
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      code,
      details,
    },
    { status }
  );
}

export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  console.error('API Error:', error);

  if (error instanceof Error) {
    return apiError(error.message, 500);
  }

  return apiError('An unexpected error occurred', 500);
}
