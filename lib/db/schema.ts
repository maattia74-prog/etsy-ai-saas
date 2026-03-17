import { pgTable, uuid, text, timestamp, real, integer, jsonb, boolean, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==================== USERS & AUTH ====================

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  imageUrl: text('image_url'),
  subscriptionTier: text('subscription_tier').default('free').notNull(), // free, pro, enterprise
  subscriptionStatus: text('subscription_status').default('active'),
  stripeCustomerId: text('stripe_customer_id').unique(),
  apiQuotaUsed: integer('api_quota_used').default(0).notNull(),
  apiQuotaLimit: integer('api_quota_limit').default(5).notNull(),
  monthlyResetDate: timestamp('monthly_reset_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: uniqueIndex('email_idx').on(table.email),
}));

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  keyHash: text('key_hash').notNull().unique(),
  keyPreview: text('key_preview').notNull(),
  name: text('name').notNull(),
  permissions: text('permissions').array().default([]).notNull(),
  rateLimit: integer('rate_limit').default(100).notNull(),
  requestCount: integer('request_count').default(0).notNull(),
  lastUsedAt: timestamp('last_used_at'),
  expiresAt: timestamp('expires_at'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('api_keys_user_id_idx').on(table.userId),
}));

// ==================== PRODUCTS ====================

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  etsyId: text('etsy_id').unique(),
  title: text('title').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  currency: text('currency').default('USD').notNull(),
  category: text('category'),
  tags: text('tags').array().default([]),
  imageUrl: text('image_url'),
  shopName: text('shop_name'),
  shopUrl: text('shop_url'),
  salesCount: integer('sales_count').default(0),
  reviewCount: integer('review_count').default(0),
  rating: real('rating'),
  isTracked: boolean('is_tracked').default(false).notNull(),
  lastScrapedAt: timestamp('last_scraped_at'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('products_user_id_idx').on(table.userId),
  etsyIdIdx: index('products_etsy_id_idx').on(table.etsyId),
}));

// ==================== KEYWORDS ====================

export const keywords = pgTable('keywords', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  keyword: text('keyword').notNull(),
  searchVolume: integer('search_volume'),
  competition: text('competition'), // low, medium, high
  cpc: real('cpc'),
  difficulty: integer('difficulty'), // 0-100
  opportunityScore: real('opportunity_score'), // AI-calculated
  trend: text('trend'), // up, down, stable
  trendData: jsonb('trend_data'), // Historical data
  relatedKeywords: text('related_keywords').array().default([]),
  categoryTags: text('category_tags').array().default([]),
  lastAnalyzedAt: timestamp('last_analyzed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('keywords_user_id_idx').on(table.userId),
  keywordIdx: index('keywords_keyword_idx').on(table.keyword),
}));

// ==================== COMPETITORS ====================

export const competitors = pgTable('competitors', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  etsyShopUrl: text('etsy_shop_url'),
  etsyShopId: text('etsy_shop_id'),
  description: text('description'),
  productCount: integer('product_count').default(0),
  averagePrice: real('average_price'),
  salesEstimate: integer('sales_estimate'),
  reviewAverage: real('review_average'),
  topProducts: jsonb('top_products'), // Array of product data
  strengths: text('strengths').array().default([]),
  weaknesses: text('weaknesses').array().default([]),
  marketShare: real('market_share'),
  analysisData: jsonb('analysis_data'), // AI analysis results
  lastAnalyzedAt: timestamp('last_analyzed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('competitors_user_id_idx').on(table.userId),
}));

// ==================== AI EMBEDDINGS ====================

export const embeddings = pgTable('embeddings', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
  contentType: text('content_type').notNull(), // product, keyword, review, competitor
  contentId: text('content_id').notNull(),
  content: text('content').notNull(),
  embedding: jsonb('embedding'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  contentTypeIdx: index('embeddings_content_type_idx').on(table.contentType),
  contentIdIdx: index('embeddings_content_id_idx').on(table.contentId),
}));

// ==================== AI ANALYSES ====================

export const aiAnalyses = pgTable('ai_analyses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  analysisType: text('analysis_type').notNull(), // pricing, trend, competitor, classification, summarization
  inputData: jsonb('input_data').notNull(),
  results: jsonb('results').notNull(),
  confidence: real('confidence'),
  model: text('model'), // Which AI model was used
  provider: text('provider'), // cloudflare, groq, together, openai
  tokensUsed: integer('tokens_used'),
  costUsd: real('cost_usd'),
  processingTimeMs: integer('processing_time_ms'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('ai_analyses_user_id_idx').on(table.userId),
  typeIdx: index('ai_analyses_type_idx').on(table.analysisType),
}));

// ==================== TRENDS ====================

export const trends = pgTable('trends', {
  id: uuid('id').defaultRandom().primaryKey(),
  category: text('category').notNull(),
  keyword: text('keyword'),
  trendData: jsonb('trend_data').notNull(), // Time series data
  prediction: jsonb('prediction'), // Future forecast
  confidence: real('confidence'),
  growthRate: real('growth_rate'),
  seasonality: text('seasonality'), // high, medium, low
  peakMonths: text('peak_months').array().default([]),
  analysisSource: text('analysis_source'), // ai, etsy_api, manual
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  categoryIdx: index('trends_category_idx').on(table.category),
  keywordIdx: index('trends_keyword_idx').on(table.keyword),
}));

// ==================== SUBSCRIPTIONS ====================

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripePriceId: text('stripe_price_id'),
  status: text('status').notNull(), // active, canceled, past_due, trialing
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  canceledAt: timestamp('canceled_at'),
  trialEnd: timestamp('trial_end'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== ANALYTICS ====================

export const analytics = pgTable('analytics', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  featureName: text('feature_name').notNull(),
  action: text('action').notNull(), // view, click, generate, analyze
  metadata: jsonb('metadata'),
  durationMs: integer('duration_ms'),
  success: boolean('success').default(true),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('analytics_user_id_idx').on(table.userId),
  featureIdx: index('analytics_feature_idx').on(table.featureName),
  createdAtIdx: index('analytics_created_at_idx').on(table.createdAt),
}));

// ==================== NOTIFICATIONS ====================

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').notNull(), // success, warning, error, info
  title: text('title').notNull(),
  message: text('message').notNull(),
  actionUrl: text('action_url'),
  actionLabel: text('action_label'),
  isRead: boolean('is_read').default(false).notNull(),
  readAt: timestamp('read_at'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('notifications_user_id_idx').on(table.userId),
  isReadIdx: index('notifications_is_read_idx').on(table.isRead),
}));

// ==================== SAVED SEARCHES ====================

export const savedSearches = pgTable('saved_searches', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  searchType: text('search_type').notNull(), // products, keywords, competitors, trends
  filters: jsonb('filters').notNull(),
  resultsCount: integer('results_count'),
  isScheduled: boolean('is_scheduled').default(false),
  scheduleFrequency: text('schedule_frequency'), // daily, weekly, monthly
  lastRunAt: timestamp('last_run_at'),
  nextRunAt: timestamp('next_run_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('saved_searches_user_id_idx').on(table.userId),
}));

// ==================== OPPORTUNITIES ====================

export const opportunities = pgTable('opportunities', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').notNull(), // niche, keyword, product, pricing
  title: text('title').notNull(),
  description: text('description'),
  score: real('score').notNull(), // 0-100
  potentialRevenue: real('potential_revenue'),
  difficulty: text('difficulty'), // easy, medium, hard
  timeframe: text('timeframe'), // short, medium, long
  data: jsonb('data').notNull(),
  actionItems: text('action_items').array().default([]),
  isBookmarked: boolean('is_bookmarked').default(false),
  status: text('status').default('new'), // new, in_progress, completed, dismissed
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('opportunities_user_id_idx').on(table.userId),
  scoreIdx: index('opportunities_score_idx').on(table.score),
}));

// ==================== RELATIONS ====================

export const usersRelations = relations(users, ({ many, one }) => ({
  apiKeys: many(apiKeys),
  products: many(products),
  keywords: many(keywords),
  competitors: many(competitors),
  aiAnalyses: many(aiAnalyses),
  subscription: one(subscriptions),
  analytics: many(analytics),
  notifications: many(notifications),
  savedSearches: many(savedSearches),
  opportunities: many(opportunities),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}));

export const productsRelations = relations(products, ({ one }) => ({
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
}));

export const keywordsRelations = relations(keywords, ({ one }) => ({
  user: one(users, {
    fields: [keywords.userId],
    references: [users.id],
  }),
}));

export const competitorsRelations = relations(competitors, ({ one }) => ({
  user: one(users, {
    fields: [competitors.userId],
    references: [users.id],
  }),
}));

export const aiAnalysesRelations = relations(aiAnalyses, ({ one }) => ({
  user: one(users, {
    fields: [aiAnalyses.userId],
    references: [users.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));
