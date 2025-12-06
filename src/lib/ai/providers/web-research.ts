/**
 * Web Research Provider
 * 
 * Integrates with Tavily API for real-time web search to enrich case studies
 * with current data, real quotes, competitor information, and more.
 */

// ============================================================================
// Types
// ============================================================================

export interface WebSearchResult {
  title: string
  url: string
  content: string
  score: number
  publishedDate?: string
}

export interface SearchResponse {
  results: WebSearchResult[]
  query: string
}

export interface AttributedQuote {
  text: string
  speaker: string
  role: string
  source: string
  date?: string
  context?: string
}

export interface CompetitorInsight {
  name: string
  reaction?: string
  competitiveMove?: string
  source: string
  date?: string
}

export interface AnalystComment {
  analyst: string
  firm?: string
  rating?: string
  comment: string
  source: string
  date?: string
}

export interface HistoricalPrecedent {
  company: string
  situation: string
  outcome: string
  relevance: string
  year: number
  source?: string
}

export interface FinancialDataPoint {
  metric: string
  value: string
  period?: string
  source: string
}

export interface OutcomeData {
  description: string
  timeframe: string
  keyResults: string[]
  source: string
}

export interface EnrichedResearch {
  // Current financial data
  financials: FinancialDataPoint[]
  
  // Competitor reactions and moves
  competitorMoves: CompetitorInsight[]
  
  // Real quotes from executives, analysts, etc.
  realQuotes: AttributedQuote[]
  
  // Analyst perspectives
  analystPerspectives: AnalystComment[]
  
  // Historical precedents from other companies
  historicalPrecedents: HistoricalPrecedent[]
  
  // What actually happened (for past events)
  outcome?: OutcomeData
  
  // Full source list for provenance
  sources: {
    url: string
    title: string
    retrievedAt: string
  }[]
  
  // Metadata
  enrichmentTimestamp: string
  searchQueries: string[]
}

export interface ExtractedEntities {
  primaryCompany: string
  secondaryCompanies: string[]
  executives: { name: string; title: string; company?: string }[]
  competitors: string[]
  keyEvents: { event: string; date?: string; isPast?: boolean }[]
  industry: string
  keywords: string[]
  centralChallenge?: string
}

// ============================================================================
// Tavily API Client
// ============================================================================

interface TavilySearchParams {
  query: string
  search_depth?: 'basic' | 'advanced'
  include_domains?: string[]
  exclude_domains?: string[]
  max_results?: number
  include_raw_content?: boolean
  include_answer?: boolean
}

interface TavilyResult {
  title: string
  url: string
  content: string
  raw_content?: string
  score: number
  published_date?: string
}

interface TavilyResponse {
  query: string
  answer?: string
  results: TavilyResult[]
}

class TavilyClient {
  private apiKey: string
  private baseUrl = 'https://api.tavily.com'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async search(params: TavilySearchParams): Promise<SearchResponse> {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: this.apiKey,
        query: params.query,
        search_depth: params.search_depth || 'basic',
        include_domains: params.include_domains,
        exclude_domains: params.exclude_domains,
        max_results: params.max_results || 5,
        include_raw_content: params.include_raw_content || false,
        include_answer: params.include_answer || false,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Tavily API error: ${response.status} - ${error}`)
    }

    const data: TavilyResponse = await response.json()
    
    return {
      query: data.query,
      results: data.results.map(r => ({
        title: r.title,
        url: r.url,
        content: r.content,
        score: r.score,
        publishedDate: r.published_date,
      })),
    }
  }
}

// ============================================================================
// Web Research Provider
// ============================================================================

export class WebResearchProvider {
  private client: TavilyClient | null = null
  private isEnabled: boolean = false

  constructor() {
    const apiKey = process.env.TAVILY_API_KEY
    if (apiKey && apiKey !== 'your-tavily-api-key') {
      this.client = new TavilyClient(apiKey)
      this.isEnabled = true
    } else {
      console.warn('TAVILY_API_KEY not configured. Web research will be disabled.')
    }
  }

  /**
   * Check if web research is available
   */
  isAvailable(): boolean {
    return this.isEnabled && this.client !== null
  }

  /**
   * Run a single web search
   */
  async search(query: string, options?: {
    maxResults?: number
    searchDepth?: 'basic' | 'advanced'
    includeDomains?: string[]
    excludeDomains?: string[]
  }): Promise<SearchResponse> {
    if (!this.client) {
      return { query, results: [] }
    }

    try {
      return await this.client.search({
        query,
        max_results: options?.maxResults || 5,
        search_depth: options?.searchDepth || 'basic',
        include_domains: options?.includeDomains,
        exclude_domains: options?.excludeDomains,
      })
    } catch (error) {
      console.error(`Web search failed for "${query}":`, error)
      return { query, results: [] }
    }
  }

  /**
   * Search for company financial data
   */
  async searchFinancials(companyName: string): Promise<SearchResponse> {
    const queries = [
      `${companyName} revenue earnings 2024`,
      `${companyName} financial results latest`,
    ]
    
    const results: WebSearchResult[] = []
    for (const query of queries) {
      const response = await this.search(query, {
        maxResults: 3,
        includeDomains: ['reuters.com', 'bloomberg.com', 'wsj.com', 'ft.com', 'cnbc.com', 'sec.gov'],
      })
      results.push(...response.results)
    }
    
    return { query: `${companyName} financials`, results }
  }

  /**
   * Search for competitor reactions and moves
   */
  async searchCompetitorMoves(
    companyName: string,
    competitors: string[],
    event?: string
  ): Promise<SearchResponse> {
    const results: WebSearchResult[] = []
    
    for (const competitor of competitors.slice(0, 3)) {
      const query = event
        ? `${competitor} response to ${companyName} ${event}`
        : `${competitor} vs ${companyName} competitive strategy`
      
      const response = await this.search(query, { maxResults: 2 })
      results.push(...response.results)
    }
    
    return { query: `${companyName} competitor moves`, results }
  }

  /**
   * Search for executive quotes
   */
  async searchExecutiveQuotes(
    companyName: string,
    executives: { name: string; title: string }[],
    topic?: string
  ): Promise<SearchResponse> {
    const results: WebSearchResult[] = []
    
    // Search for CEO/leadership quotes
    const leadershipQuery = topic
      ? `${companyName} CEO interview "${topic}"`
      : `${companyName} CEO interview statement 2024`
    
    const leadershipResults = await this.search(leadershipQuery, {
      maxResults: 3,
      includeDomains: ['cnbc.com', 'bloomberg.com', 'wsj.com', 'ft.com', 'fortune.com'],
    })
    results.push(...leadershipResults.results)
    
    // Search for earnings call transcripts
    const earningsQuery = `${companyName} earnings call transcript`
    const earningsResults = await this.search(earningsQuery, {
      maxResults: 2,
      includeDomains: ['seekingalpha.com', 'fool.com', 'nasdaq.com'],
    })
    results.push(...earningsResults.results)
    
    // Search for specific executives if provided
    for (const exec of executives.slice(0, 2)) {
      const execQuery = `"${exec.name}" ${companyName} interview statement`
      const execResults = await this.search(execQuery, { maxResults: 2 })
      results.push(...execResults.results)
    }
    
    return { query: `${companyName} executive quotes`, results }
  }

  /**
   * Search for analyst commentary
   */
  async searchAnalystCommentary(companyName: string): Promise<SearchResponse> {
    const queries = [
      `${companyName} analyst rating upgrade downgrade`,
      `${companyName} stock analysis expert opinion`,
    ]
    
    const results: WebSearchResult[] = []
    for (const query of queries) {
      const response = await this.search(query, {
        maxResults: 3,
        includeDomains: ['bloomberg.com', 'reuters.com', 'marketwatch.com', 'barrons.com'],
      })
      results.push(...response.results)
    }
    
    return { query: `${companyName} analyst commentary`, results }
  }

  /**
   * Search for historical precedents
   */
  async searchHistoricalPrecedents(
    situation: string,
    industry: string
  ): Promise<SearchResponse> {
    const query = `companies that faced ${situation} ${industry} case study example`
    return this.search(query, {
      maxResults: 5,
      searchDepth: 'advanced',
    })
  }

  /**
   * Search for outcome/aftermath of an event
   */
  async searchOutcome(
    companyName: string,
    event: string
  ): Promise<SearchResponse> {
    const queries = [
      `${companyName} ${event} result aftermath`,
      `what happened after ${companyName} ${event}`,
    ]
    
    const results: WebSearchResult[] = []
    for (const query of queries) {
      const response = await this.search(query, { maxResults: 3 })
      results.push(...response.results)
    }
    
    return { query: `${companyName} ${event} outcome`, results }
  }

  /**
   * Run comprehensive enrichment search
   */
  async runEnrichmentSearches(
    entities: ExtractedEntities,
    keyEvent?: string
  ): Promise<{
    financials: SearchResponse
    competitors: SearchResponse
    quotes: SearchResponse
    analysts: SearchResponse
    precedents: SearchResponse
    outcome?: SearchResponse
  }> {
    if (!this.isAvailable()) {
      const emptyResponse: SearchResponse = { query: '', results: [] }
      return {
        financials: emptyResponse,
        competitors: emptyResponse,
        quotes: emptyResponse,
        analysts: emptyResponse,
        precedents: emptyResponse,
      }
    }

    console.log('Running enrichment searches for:', entities.primaryCompany)

    // Run searches in parallel for speed
    const [financials, competitors, quotes, analysts, precedents] = await Promise.all([
      this.searchFinancials(entities.primaryCompany),
      this.searchCompetitorMoves(entities.primaryCompany, entities.competitors, keyEvent),
      this.searchExecutiveQuotes(entities.primaryCompany, entities.executives, keyEvent),
      this.searchAnalystCommentary(entities.primaryCompany),
      this.searchHistoricalPrecedents(
        keyEvent || `${entities.industry} challenges`,
        entities.industry
      ),
    ])

    // Optionally search for outcome if we have a specific event
    let outcome: SearchResponse | undefined
    if (keyEvent) {
      outcome = await this.searchOutcome(entities.primaryCompany, keyEvent)
    }

    console.log(`Enrichment searches complete:
  - Financials: ${financials.results.length} results
  - Competitors: ${competitors.results.length} results
  - Quotes: ${quotes.results.length} results
  - Analysts: ${analysts.results.length} results
  - Precedents: ${precedents.results.length} results
  ${outcome ? `- Outcome: ${outcome.results.length} results` : ''}`)

    return {
      financials,
      competitors,
      quotes,
      analysts,
      precedents,
      outcome,
    }
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let webResearchProvider: WebResearchProvider | null = null

export function getWebResearchProvider(): WebResearchProvider {
  if (!webResearchProvider) {
    webResearchProvider = new WebResearchProvider()
  }
  return webResearchProvider
}

