import Groq from 'groq-sdk';
import Together from 'together-ai';
import OpenAI from 'openai';

export type AIProvider = 'cloudflare' | 'groq' | 'together' | 'openai';

interface AIConfig {
  userId: string;
  quotaUsed: number;
  quotaLimit: number;
  subscriptionTier: 'free' | 'pro' | 'enterprise';
}

interface EmbeddingResult {
  embedding: number[];
  tokensUsed: number;
  provider: AIProvider;
  costUsd: number;
}

interface ChatResult {
  content: string;
  tokensUsed: number;
  provider: AIProvider;
  costUsd: number;
}

export class AIClient {
  private groq: Groq | null = null;
  private together: Together | null = null;
  private openai: OpenAI | null = null;

  constructor() {
    if (process.env.GROQ_API_KEY) {
      this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    if (process.env.TOGETHER_API_KEY) {
      this.together = new Together({ apiKey: process.env.TOGETHER_API_KEY });
    }
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
  }

  private selectProvider(config: AIConfig, task: 'embedding' | 'chat'): AIProvider {
    const { subscriptionTier, quotaUsed, quotaLimit } = config;

    // Embeddings always use OpenAI (most reliable)
    if (task === 'embedding') {
      return 'openai';
    }

    // Free tier: Groq (has generous free tier)
    if (subscriptionTier === 'free') {
      if (quotaUsed < quotaLimit && this.groq) {
        return 'groq';
      }
      // Fallback to Together (cheaper)
      if (this.together) return 'together';
    }

    // Pro tier: Prefer Groq for speed
    if (subscriptionTier === 'pro' && this.groq) {
      return 'groq';
    }

    // Enterprise: Together for cost-effectiveness
    if (this.together) return 'together';

    // Final fallback
    if (this.openai) return 'openai';
    
    throw new Error('No AI provider available');
  }

  private calculateCost(provider: AIProvider, inputTokens: number, outputTokens: number): number {
    const costs = {
      openai: { input: 0.0001, output: 0.0002 }, // GPT-4o-mini
      groq: { input: 0.00059, output: 0.00079 },
      together: { input: 0.00018, output: 0.00018 },
      cloudflare: { input: 0.0005, output: 0.0015 },
    };

    const cost = costs[provider];
    return ((inputTokens * cost.input) + (outputTokens * cost.output)) / 1000;
  }

  async generateEmbedding(text: string, config: AIConfig): Promise<EmbeddingResult> {
    if (!this.openai) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
      });

      return {
        embedding: response.data[0].embedding,
        tokensUsed: response.usage.total_tokens,
        provider: 'openai',
        costUsd: this.calculateCost('openai', response.usage.total_tokens, 0),
      };
    } catch (error) {
      console.error('Embedding generation failed:', error);
      throw new Error('Failed to generate embedding');
    }
  }

  async chat(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    config: AIConfig,
    options: {
      temperature?: number;
      maxTokens?: number;
      json?: boolean;
    } = {}
  ): Promise<ChatResult> {
    const provider = this.selectProvider(config, 'chat');
    const { temperature = 0.7, maxTokens = 1000, json = false } = options;

    try {
      if (provider === 'groq' && this.groq) {
        const response = await this.groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages,
          temperature,
          max_tokens: maxTokens,
          response_format: json ? { type: 'json_object' } : undefined,
        });

        const content = response.choices[0].message.content || '';
        const usage = response.usage!;

        return {
          content,
          tokensUsed: usage.total_tokens,
          provider: 'groq',
          costUsd: this.calculateCost('groq', usage.prompt_tokens, usage.completion_tokens),
        };
      }

      if (provider === 'together' && this.together) {
        const response = await this.together.chat.completions.create({
          model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
          messages,
          temperature,
          max_tokens: maxTokens,
        });

        const content = response.choices[0].message.content || '';
        const usage = response.usage!;

        return {
          content,
          tokensUsed: usage.total_tokens,
          provider: 'together',
          costUsd: this.calculateCost('together', usage.prompt_tokens, usage.completion_tokens),
        };
      }

      if (provider === 'openai' && this.openai) {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
          temperature,
          max_tokens: maxTokens,
          response_format: json ? { type: 'json_object' } : undefined,
        });

        const content = response.choices[0].message.content || '';
        const usage = response.usage!;

        return {
          content,
          tokensUsed: usage.total_tokens,
          provider: 'openai',
          costUsd: this.calculateCost('openai', usage.prompt_tokens, usage.completion_tokens),
        };
      }

      throw new Error('No AI provider available');
    } catch (error) {
      console.error(`AI chat failed with provider ${provider}:`, error);
      throw new Error('AI processing failed');
    }
  }

  async classifyContent(
    content: string,
    categories: string[],
    config: AIConfig
  ): Promise<{ category: string; confidence: number }> {
    const prompt = `Classify this content into ONE of these categories: ${categories.join(', ')}

Content: ${content}

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{"category": "exact_category_name", "confidence": 0.95}`;

    const result = await this.chat(
      [{ role: 'user', content: prompt }],
      config,
      { json: true, temperature: 0.3 }
    );

    try {
      const parsed = JSON.parse(result.content);
      return {
        category: parsed.category,
        confidence: parsed.confidence,
      };
    } catch {
      // Fallback if JSON parsing fails
      return {
        category: categories[0],
        confidence: 0.5,
      };
    }
  }

  async summarize(content: string, maxWords: number, config: AIConfig): Promise<string> {
    const result = await this.chat(
      [
        {
          role: 'user',
          content: `Summarize this in ${maxWords} words or less:\n\n${content}`,
        },
      ],
      config,
      { temperature: 0.5, maxTokens: maxWords * 2 }
    );

    return result.content;
  }

  async analyzePricing(
    product: {
      title: string;
      description: string;
      currentPrice?: number;
      category: string;
    },
    competitors: Array<{
      title: string;
      price: number;
      sales: number;
    }>,
    config: AIConfig
  ): Promise<{
    suggestedPrice: number;
    priceRange: { min: number; max: number };
    strategy: 'premium' | 'competitive' | 'value';
    reasoning: string;
    confidence: number;
  }> {
    const prompt = `Analyze optimal pricing for this product:

Product:
- Title: ${product.title}
- Description: ${product.description}
- Current Price: ${product.currentPrice || 'Not set'}
- Category: ${product.category}

Competitors:
${competitors.map((c, i) => `${i + 1}. ${c.title}: $${c.price} (${c.sales} sales)`).join('\n')}

Return ONLY valid JSON:
{
  "suggestedPrice": number,
  "priceRange": {"min": number, "max": number},
  "strategy": "premium" OR "competitive" OR "value",
  "reasoning": "brief explanation",
  "confidence": number between 0-1
}`;

    const result = await this.chat(
      [{ role: 'user', content: prompt }],
      config,
      { json: true, temperature: 0.4 }
    );

    return JSON.parse(result.content);
  }

  async predictTrends(
    keyword: string,
    historicalData: Array<{ date: string; searches: number; sales: number }>,
    config: AIConfig
  ): Promise<{
    prediction: 'growing' | 'declining' | 'stable';
    growthRate: number;
    confidence: number;
    peakMonths: string[];
    reasoning: string;
  }> {
    const prompt = `Predict market trends for "${keyword}" based on historical data:

Data: ${JSON.stringify(historicalData, null, 2)}

Return ONLY valid JSON:
{
  "prediction": "growing" OR "declining" OR "stable",
  "growthRate": percentage as decimal (e.g., 0.15 for 15%),
  "confidence": number between 0-1,
  "peakMonths": ["month1", "month2"],
  "reasoning": "brief explanation"
}`;

    const result = await this.chat(
      [{ role: 'user', content: prompt }],
      config,
      { json: true, temperature: 0.4 }
    );

    return JSON.parse(result.content);
  }

  async analyzeCompetitor(
    competitor: {
      name: string;
      products: Array<{
        title: string;
        price: number;
        sales: number;
        reviews: number;
      }>;
    },
    config: AIConfig
  ): Promise<{
    strengths: string[];
    weaknesses: string[];
    marketPosition: 'leader' | 'challenger' | 'follower';
    recommendations: string[];
  }> {
    const prompt = `Analyze this competitor:

Name: ${competitor.name}
Products: ${JSON.stringify(competitor.products, null, 2)}

Return ONLY valid JSON:
{
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "marketPosition": "leader" OR "challenger" OR "follower",
  "recommendations": ["action1", "action2"]
}`;

    const result = await this.chat(
      [{ role: 'user', content: prompt }],
      config,
      { json: true, temperature: 0.5 }
    );

    return JSON.parse(result.content);
  }
}

// Singleton instance
let aiClientInstance: AIClient | null = null;

export function getAIClient(): AIClient {
  if (!aiClientInstance) {
    aiClientInstance = new AIClient();
  }
  return aiClientInstance;
}
