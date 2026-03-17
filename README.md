# Etsy AI Pro - AI-Powered Etsy Research Platform

A comprehensive AI-powered SaaS platform for Etsy sellers to discover winning products, optimize pricing, track competitors, and dominate their niche with advanced analytics.

## 🚀 Features

### Core AI Capabilities
- **Product Research**: AI-powered semantic search and trend analysis
- **Keyword Analysis**: Competitor keyword analysis and opportunity scoring
- **Trend Prediction**: AI forecasting and seasonal demand analysis
- **Competitor Tracking**: Strategic recommendations and market positioning
- **Smart Pricing**: AI-driven competitive analysis and optimization
- **Content Generation**: AI-powered product descriptions and marketing copy

### Platform Features
- **28 Advanced Features**: Complete suite of Etsy research tools
- **Multi-Provider AI**: OpenAI, Groq, Together.ai integration
- **Real-time Analytics**: Live market data and instant insights
- **API Access**: Full REST API for programmatic access
- **Team Collaboration**: Multi-user workspaces and sharing
- **Enterprise Security**: Bank-level encryption and compliance

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes, Drizzle ORM
- **Database**: Neon PostgreSQL with pgvector for embeddings
- **AI**: OpenAI, Groq, Together.ai, Cloudflare Workers
- **Authentication**: Clerk
- **Payments**: Stripe
- **Storage**: Cloudflare R2
- **Rate Limiting**: Upstash Redis

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL (Neon recommended)
- Clerk account
- Stripe account
- AI provider API keys

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd etsy-ai-saas
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
# Fill in all environment variables
```

### 3. Database Setup

```bash
# Generate migration
npm run db:generate

# Push to database
npm run db:push

# (Optional) Open Drizzle Studio
npm run db:studio
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Environment Variables

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Neon Database
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# AI Providers
OPENAI_API_KEY=sk-...
GROQ_API_KEY=gsk_...
TOGETHER_API_KEY=...

# Cloudflare R2
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📊 Database Schema

The platform uses a comprehensive database schema with 13 tables:

- **Users & Auth**: Users, API Keys, Subscriptions
- **Core Data**: Products, Keywords, Competitors
- **AI Features**: Embeddings, AI Analyses, Trends
- **Platform**: Analytics, Notifications, Saved Searches, Opportunities

## 🤖 AI Integration

### Multi-Provider Architecture
- **Free Tier**: Groq (generous free tier)
- **Pro Tier**: Groq for speed, Together for cost-effectiveness
- **Enterprise**: Together for cost optimization
- **Embeddings**: Always use OpenAI for reliability

### AI Features
- **Semantic Search**: Vector similarity with pgvector
- **Content Classification**: Multi-category classification
- **Text Summarization**: Variable-length summarization
- **Pricing Analysis**: Competitive pricing optimization
- **Trend Prediction**: Time series forecasting
- **Competitor Analysis**: Strategic recommendations

## 💳 Subscription Tiers

| Feature | Free | Pro ($29/mo) | Enterprise ($99/mo) |
|---------|------|-------------|-------------------|
| AI Analyses | 5/mo | 100/mo | Unlimited |
| Product Searches | 10 | Unlimited | Unlimited |
| Keyword Analyses | 5 | 50 | Unlimited |
| Competitor Tracking | 2 | 10 | Unlimited |
| API Access | ❌ | ✅ | ✅ |
| Team Collaboration | ❌ | ❌ | ✅ |

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Cloudflare Pages

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy .next
```

## 📚 API Documentation

### Authentication
```bash
curl https://api.yourdomain.com/v1/products \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Search Products
```bash
curl https://api.yourdomain.com/v1/ai/search \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "handmade jewelry", "limit": 10}'
```

## 🔒 Security

- **Authentication**: Clerk with multi-factor auth
- **Data Encryption**: AES-256 at rest and in transit
- **API Security**: Rate limiting, JWT tokens, CORS
- **Compliance**: GDPR, CCPA compliant
- **Audit Logs**: Complete activity tracking

## 📈 Performance

- **CDN**: Cloudflare global CDN
- **Database**: Neon serverless PostgreSQL
- **AI**: Multi-provider with intelligent routing
- **Monitoring**: Real-time error tracking
- **Optimization**: Lazy loading, code splitting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.yourdomain.com](https://docs.yourdomain.com)
- **API Reference**: [api.yourdomain.com/docs](https://api.yourdomain.com/docs)
- **Support**: support@yourdomain.com
- **Community**: [discord.gg/yourdomain](https://discord.gg/yourdomain)

---

Built with ❤️ for Etsy sellers worldwide.
