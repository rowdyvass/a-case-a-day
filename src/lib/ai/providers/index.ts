import type { AIProvider, ProviderType } from './types'
import { OpenAIProvider } from './openai'
import { AnthropicProvider } from './anthropic'

export * from './types'
export { OpenAIProvider } from './openai'
export { AnthropicProvider } from './anthropic'
export { GeminiImageProvider, getGeminiImageProvider } from './gemini-image'
export type { IllustrationResult, IllustrationContext } from './gemini-image'

// Simple in-memory cache for expensive operations
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 30 // 30 minutes

function getCached<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T
  }
  cache.delete(key)
  return null
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// Provider factory with fallback support
class AIProviderManager {
  private providers: Map<ProviderType, AIProvider> = new Map()
  private preferredProvider: ProviderType

  constructor(preferredProvider: ProviderType = 'anthropic') {
    this.preferredProvider = preferredProvider
    
    // Initialize providers based on available API keys
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key') {
      this.providers.set('openai', new OpenAIProvider())
    }
    if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your-anthropic-api-key') {
      this.providers.set('anthropic', new AnthropicProvider())
    }
  }

  getProvider(type?: ProviderType): AIProvider {
    const providerType = type || this.preferredProvider
    const provider = this.providers.get(providerType)
    
    if (provider) {
      return provider
    }

    // Fallback to any available provider
    const [fallbackProvider] = this.providers.values()
    if (fallbackProvider) {
      console.warn(`Requested provider ${providerType} not available, using ${fallbackProvider.name}`)
      return fallbackProvider
    }

    throw new Error('No AI provider available. Please configure OPENAI_API_KEY or ANTHROPIC_API_KEY.')
  }

  async researchCompanyWithCache(
    companyName: string,
    industry: string,
    providerType?: ProviderType
  ) {
    const cacheKey = `research:${companyName}:${industry}`
    const cached = getCached<Awaited<ReturnType<AIProvider['researchCompany']>>>(cacheKey)
    if (cached) {
      console.log('Using cached research data')
      return cached
    }

    const provider = this.getProvider(providerType)
    const result = await provider.researchCompany(companyName, industry)
    setCache(cacheKey, result)
    return result
  }

  setPreferredProvider(type: ProviderType): void {
    if (!this.providers.has(type)) {
      throw new Error(`Provider ${type} is not available`)
    }
    this.preferredProvider = type
  }

  getAvailableProviders(): ProviderType[] {
    return Array.from(this.providers.keys())
  }
}

// Singleton instance
let providerManager: AIProviderManager | null = null

export function getAIProvider(type?: ProviderType): AIProvider {
  if (!providerManager) {
    providerManager = new AIProviderManager()
  }
  return providerManager.getProvider(type)
}

export function getAIProviderManager(): AIProviderManager {
  if (!providerManager) {
    providerManager = new AIProviderManager()
  }
  return providerManager
}


