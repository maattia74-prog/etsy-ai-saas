import { z } from 'zod';

// Product validation
export const productSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().optional(),
  price: z.number().positive(),
  currency: z.string().default('USD'),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  etsyId: z.string().optional(),
});

// Keyword validation
export const keywordSchema = z.object({
  keyword: z.string().min(1).max(200),
  searchVolume: z.number().optional(),
  competition: z.enum(['low', 'medium', 'high']).optional(),
  cpc: z.number().optional(),
});

// Competitor validation
export const competitorSchema = z.object({
  name: z.string().min(1).max(200),
  etsyShopUrl: z.string().url().optional(),
  description: z.string().optional(),
});

// AI analysis validation
export const aiAnalysisSchema = z.object({
  analysisType: z.enum(['pricing', 'trend', 'competitor', 'classification', 'summarization']),
  inputData: z.record(z.any()),
});

// Search validation
export const searchSchema = z.object({
  query: z.string().min(1).max(500),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
});

// API key validation
export const apiKeySchema = z.object({
  name: z.string().min(1).max(100),
  permissions: z.array(z.enum(['read', 'write', 'ai'])).default(['read']),
  rateLimit: z.number().min(1).max(10000).default(100),
  expiresAt: z.string().datetime().optional(),
});
