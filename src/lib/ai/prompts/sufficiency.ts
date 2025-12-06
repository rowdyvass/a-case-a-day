/**
 * Research Sufficiency Check
 * 
 * Evaluates whether we have enough enrichment data to produce a credible case study.
 * Runs after Phase 3 (Research Enrichment) before spending tokens on protagonist/narrative.
 */

import type { EnrichedResearch } from '../providers/web-research'
import type { ResearchData } from '../providers/types'

// ============================================================================
// Types
// ============================================================================

export interface SufficiencyResult {
  score: number // 0-100
  level: 'full' | 'partial' | 'basic'
  isAcceptable: boolean
  
  categories: {
    financials: CategoryScore
    quotes: CategoryScore
    competitors: CategoryScore
    analysts: CategoryScore
    precedents: CategoryScore
    baseResearch: CategoryScore
  }
  
  recommendations: string[]
  adjustments: ScopeAdjustment[]
  summary: string
}

export interface CategoryScore {
  score: number // 0-100
  count: number
  required: number
  status: 'sufficient' | 'partial' | 'missing'
  details: string
}

export interface ScopeAdjustment {
  category: string
  action: 'fetch_more' | 'adjust_scope' | 'accept_gap'
  description: string
  priority: 'high' | 'medium' | 'low'
}

// ============================================================================
// Constants
// ============================================================================

const SUFFICIENCY_THRESHOLDS = {
  full: 80,      // Full enriched case
  partial: 50,   // Partial enrichment, proceed with available data
  minimum: 30,   // Basic case with LLM research only
}

const CATEGORY_WEIGHTS = {
  financials: 0.20,
  quotes: 0.20,
  competitors: 0.15,
  analysts: 0.10,
  precedents: 0.10,
  baseResearch: 0.25, // LLM-generated research data
}

const MINIMUM_REQUIREMENTS = {
  financials: 2,
  quotes: 1,
  competitors: 1,
  analysts: 0, // Nice to have
  precedents: 0, // Nice to have
}

// ============================================================================
// Main Function
// ============================================================================

/**
 * Check research sufficiency before proceeding with case generation
 */
export function checkResearchSufficiency(
  researchData: ResearchData,
  enrichedResearch?: EnrichedResearch
): SufficiencyResult {
  const categories = evaluateCategories(researchData, enrichedResearch)
  
  // Calculate weighted score
  const score = Math.round(
    categories.financials.score * CATEGORY_WEIGHTS.financials +
    categories.quotes.score * CATEGORY_WEIGHTS.quotes +
    categories.competitors.score * CATEGORY_WEIGHTS.competitors +
    categories.analysts.score * CATEGORY_WEIGHTS.analysts +
    categories.precedents.score * CATEGORY_WEIGHTS.precedents +
    categories.baseResearch.score * CATEGORY_WEIGHTS.baseResearch
  )
  
  // Determine level
  let level: SufficiencyResult['level']
  if (score >= SUFFICIENCY_THRESHOLDS.full) {
    level = 'full'
  } else if (score >= SUFFICIENCY_THRESHOLDS.partial) {
    level = 'partial'
  } else {
    level = 'basic'
  }
  
  // Generate recommendations and adjustments
  const { recommendations, adjustments } = generateRecommendations(categories, level)
  
  // Determine if acceptable to proceed
  const isAcceptable = score >= SUFFICIENCY_THRESHOLDS.minimum
  
  // Generate summary
  const summary = generateSummary(score, level, categories)
  
  return {
    score,
    level,
    isAcceptable,
    categories,
    recommendations,
    adjustments,
    summary,
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function evaluateCategories(
  researchData: ResearchData,
  enrichedResearch?: EnrichedResearch
): SufficiencyResult['categories'] {
  // Base research evaluation
  const baseResearchScore = evaluateBaseResearch(researchData)
  
  // Enrichment evaluation (if available)
  if (!enrichedResearch) {
    return {
      financials: createMissingCategory('financials', MINIMUM_REQUIREMENTS.financials),
      quotes: createMissingCategory('quotes', MINIMUM_REQUIREMENTS.quotes),
      competitors: createMissingCategory('competitors', MINIMUM_REQUIREMENTS.competitors),
      analysts: createMissingCategory('analysts', MINIMUM_REQUIREMENTS.analysts),
      precedents: createMissingCategory('precedents', MINIMUM_REQUIREMENTS.precedents),
      baseResearch: baseResearchScore,
    }
  }
  
  return {
    financials: evaluateFinancials(enrichedResearch.financials),
    quotes: evaluateQuotes(enrichedResearch.realQuotes),
    competitors: evaluateCompetitors(enrichedResearch.competitorMoves),
    analysts: evaluateAnalysts(enrichedResearch.analystPerspectives),
    precedents: evaluatePrecedents(enrichedResearch.historicalPrecedents),
    baseResearch: baseResearchScore,
  }
}

function evaluateBaseResearch(data: ResearchData): CategoryScore {
  let score = 0
  const checks: string[] = []
  
  // Company info (40 points)
  if (data.company?.name) { score += 10; checks.push('company name') }
  if (data.company?.description) { score += 15; checks.push('description') }
  if (data.company?.revenue || data.company?.marketCap) { score += 15; checks.push('financials') }
  
  // Competitors (30 points)
  const competitorCount = data.competitors?.length || 0
  if (competitorCount >= 3) { score += 30; checks.push(`${competitorCount} competitors`) }
  else if (competitorCount >= 1) { score += 15; checks.push(`${competitorCount} competitor(s)`) }
  
  // Market data (20 points)
  if (data.marketData?.marketSize) { score += 10; checks.push('market size') }
  if (data.marketData?.trends?.length) { score += 10; checks.push('trends') }
  
  // Recent news (10 points)
  if (data.recentNews?.length) { score += 10; checks.push('recent news') }
  
  return {
    score,
    count: checks.length,
    required: 5,
    status: score >= 70 ? 'sufficient' : score >= 40 ? 'partial' : 'missing',
    details: checks.length > 0 ? `Found: ${checks.join(', ')}` : 'No base research data',
  }
}

function evaluateFinancials(financials: EnrichedResearch['financials']): CategoryScore {
  const count = financials?.length || 0
  const required = MINIMUM_REQUIREMENTS.financials
  
  let score = 0
  if (count >= 4) score = 100
  else if (count >= 3) score = 80
  else if (count >= 2) score = 60
  else if (count >= 1) score = 40
  
  return {
    score,
    count,
    required,
    status: count >= required ? 'sufficient' : count > 0 ? 'partial' : 'missing',
    details: count > 0 
      ? `${count} financial data points (revenue, margins, etc.)`
      : 'No verified financial data from web sources',
  }
}

function evaluateQuotes(quotes: EnrichedResearch['realQuotes']): CategoryScore {
  const count = quotes?.length || 0
  const required = MINIMUM_REQUIREMENTS.quotes
  
  let score = 0
  if (count >= 3) score = 100
  else if (count >= 2) score = 80
  else if (count >= 1) score = 60
  
  // Bonus for executive quotes
  const execQuotes = quotes?.filter(q => 
    q.role?.toLowerCase().includes('ceo') || 
    q.role?.toLowerCase().includes('chief') ||
    q.role?.toLowerCase().includes('president')
  ).length || 0
  
  if (execQuotes > 0 && score < 100) score += 10
  
  return {
    score: Math.min(100, score),
    count,
    required,
    status: count >= required ? 'sufficient' : count > 0 ? 'partial' : 'missing',
    details: count > 0 
      ? `${count} attributed quotes${execQuotes > 0 ? ` (${execQuotes} from executives)` : ''}`
      : 'No real quotes found from web sources',
  }
}

function evaluateCompetitors(competitors: EnrichedResearch['competitorMoves']): CategoryScore {
  const count = competitors?.length || 0
  const required = MINIMUM_REQUIREMENTS.competitors
  
  let score = 0
  if (count >= 3) score = 100
  else if (count >= 2) score = 70
  else if (count >= 1) score = 50
  
  return {
    score,
    count,
    required,
    status: count >= required ? 'sufficient' : count > 0 ? 'partial' : 'missing',
    details: count > 0 
      ? `${count} competitor insights`
      : 'No competitor reaction data',
  }
}

function evaluateAnalysts(analysts: EnrichedResearch['analystPerspectives']): CategoryScore {
  const count = analysts?.length || 0
  const required = MINIMUM_REQUIREMENTS.analysts
  
  let score = 0
  if (count >= 2) score = 100
  else if (count >= 1) score = 70
  else score = 50 // Not required, so give partial credit
  
  return {
    score,
    count,
    required,
    status: count > 0 ? 'sufficient' : 'missing',
    details: count > 0 
      ? `${count} analyst perspectives`
      : 'No analyst commentary (optional)',
  }
}

function evaluatePrecedents(precedents: EnrichedResearch['historicalPrecedents']): CategoryScore {
  const count = precedents?.length || 0
  const required = MINIMUM_REQUIREMENTS.precedents
  
  let score = 0
  if (count >= 2) score = 100
  else if (count >= 1) score = 70
  else score = 50 // Not required, so give partial credit
  
  return {
    score,
    count,
    required,
    status: count > 0 ? 'sufficient' : 'missing',
    details: count > 0 
      ? `${count} historical precedents`
      : 'No historical precedents (optional)',
  }
}

function createMissingCategory(name: string, required: number): CategoryScore {
  return {
    score: required === 0 ? 50 : 0,
    count: 0,
    required,
    status: required === 0 ? 'missing' : 'missing',
    details: `No ${name} data (web research not available)`,
  }
}

function generateRecommendations(
  categories: SufficiencyResult['categories'],
  level: SufficiencyResult['level']
): { recommendations: string[]; adjustments: ScopeAdjustment[] } {
  const recommendations: string[] = []
  const adjustments: ScopeAdjustment[] = []
  
  // Financial recommendations
  if (categories.financials.status !== 'sufficient') {
    if (categories.financials.count === 0) {
      recommendations.push('Consider searching for SEC filings, earnings reports, or financial news')
      adjustments.push({
        category: 'financials',
        action: 'fetch_more',
        description: 'Search earnings transcripts and financial news sources',
        priority: 'high',
      })
    } else {
      recommendations.push('Case will use available financial data; some figures may be approximated')
    }
  }
  
  // Quote recommendations
  if (categories.quotes.status !== 'sufficient') {
    if (categories.quotes.count === 0) {
      recommendations.push('No real quotes found; case will use fictional stakeholder quotes only')
      adjustments.push({
        category: 'quotes',
        action: 'adjust_scope',
        description: 'Generate compelling fictional stakeholder perspectives',
        priority: 'medium',
      })
    }
  }
  
  // Competitor recommendations
  if (categories.competitors.status !== 'sufficient' && categories.competitors.count === 0) {
    recommendations.push('Limited competitor data; competitive analysis may be general')
    adjustments.push({
      category: 'competitors',
      action: 'accept_gap',
      description: 'Use LLM knowledge for competitive landscape',
      priority: 'low',
    })
  }
  
  // Level-specific recommendations
  if (level === 'basic') {
    recommendations.push('Proceeding with LLM-generated research only; case will be less grounded in verified data')
  } else if (level === 'partial') {
    recommendations.push('Partial enrichment available; case will blend verified data with LLM research')
  }
  
  return { recommendations, adjustments }
}

function generateSummary(
  score: number,
  level: SufficiencyResult['level'],
  categories: SufficiencyResult['categories']
): string {
  const sufficientCategories = Object.entries(categories)
    .filter(([, cat]) => cat.status === 'sufficient')
    .map(([name]) => name)
  
  const missingCategories = Object.entries(categories)
    .filter(([, cat]) => cat.status === 'missing' && cat.required > 0)
    .map(([name]) => name)
  
  let summary = `Research sufficiency: ${score}% (${level} enrichment). `
  
  if (sufficientCategories.length > 0) {
    summary += `Strong data: ${sufficientCategories.join(', ')}. `
  }
  
  if (missingCategories.length > 0) {
    summary += `Gaps: ${missingCategories.join(', ')}. `
  }
  
  return summary.trim()
}

/**
 * Get a human-readable sufficiency summary for logging
 */
export function getSufficiencySummary(result: SufficiencyResult): string {
  return `Sufficiency: ${result.score}% (${result.level})
  Financials: ${result.categories.financials.count} items (${result.categories.financials.status})
  Quotes: ${result.categories.quotes.count} items (${result.categories.quotes.status})
  Competitors: ${result.categories.competitors.count} items (${result.categories.competitors.status})
  Base Research: ${result.categories.baseResearch.status}
  ${result.recommendations.length > 0 ? `Recommendations: ${result.recommendations.join('; ')}` : ''}`
}

/**
 * Determine if additional searches should be attempted
 */
export function shouldAttemptAdditionalSearches(result: SufficiencyResult): {
  shouldSearch: boolean
  searchTypes: string[]
} {
  if (result.level === 'full') {
    return { shouldSearch: false, searchTypes: [] }
  }
  
  const searchTypes: string[] = []
  
  if (result.categories.financials.count < 2) {
    searchTypes.push('financials')
  }
  
  if (result.categories.quotes.count < 1) {
    searchTypes.push('quotes')
  }
  
  return {
    shouldSearch: searchTypes.length > 0,
    searchTypes,
  }
}

