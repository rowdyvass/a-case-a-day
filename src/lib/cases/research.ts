import type {
  AIProvider,
  ResearchData,
  EnrichedResearch,
  SufficiencyResult,
} from './types'
import {
  getWebResearchProvider,
  type ExtractedEntities,
} from '@/lib/ai/providers/web-research'
import { extractSourcesFromSearchResults } from '@/lib/ai/prompts/enrichment'
import {
  checkResearchSufficiency,
  getSufficiencySummary,
} from '@/lib/ai/prompts/sufficiency'
import type { ResearchPhaseResult } from './types'

/**
 * Run the research phase: company research + optional web enrichment
 */
export async function runResearchPhase(
  provider: AIProvider,
  sourceArticle: string,
  companyName: string,
  industry: string,
  baseResearchData: ResearchData
): Promise<ResearchPhaseResult> {
  // Attempt web research enrichment if available
  const enrichedResearch = await runEnrichmentPhase(
    provider,
    sourceArticle,
    companyName,
    industry,
    baseResearchData
  )

  // Check research sufficiency
  const sufficiencyResult = checkResearchSufficiency(
    baseResearchData,
    enrichedResearch
  )

  // Log sufficiency summary (could be replaced with structured logging)
  const summary = getSufficiencySummary(sufficiencyResult)
  if (process.env.NODE_ENV === 'development') {
    console.log(summary)
  }

  return {
    researchData: baseResearchData,
    enrichedResearch,
    sufficiencyResult,
  }
}

/**
 * Research the company using AI provider
 */
export async function researchCompany(
  provider: AIProvider,
  companyName: string,
  industry: string
): Promise<ResearchData> {
  return provider.researchCompany(companyName, industry)
}

/**
 * Run web enrichment phase if Tavily API is available
 */
async function runEnrichmentPhase(
  provider: AIProvider,
  sourceArticle: string,
  companyName: string,
  industry: string,
  researchData: ResearchData
): Promise<EnrichedResearch | undefined> {
  const webResearch = getWebResearchProvider()

  if (!webResearch.isAvailable()) {
    return undefined
  }

  try {
    // Extract entities from the source article
    const extractedEntities: ExtractedEntities =
      await provider.extractEntities(sourceArticle)

    // Determine the key event for searches
    const keyEvent =
      extractedEntities.keyEvents.length > 0
        ? extractedEntities.keyEvents[0].event
        : undefined

    // Run parallel web searches
    const searchResults = await webResearch.runEnrichmentSearches(
      {
        primaryCompany: extractedEntities.primaryCompany || companyName,
        secondaryCompanies: extractedEntities.secondaryCompanies,
        executives: extractedEntities.executives,
        competitors:
          extractedEntities.competitors.length > 0
            ? extractedEntities.competitors
            : researchData.competitors.map((c) => c.name),
        keyEvents: extractedEntities.keyEvents,
        industry: extractedEntities.industry || industry,
        keywords: extractedEntities.keywords,
      },
      keyEvent
    )

    // Synthesize search results into structured data (in parallel)
    const [
      financials,
      realQuotes,
      competitorMoves,
      analystPerspectives,
      historicalPrecedents,
    ] = await Promise.all([
      provider.synthesizeFinancials(searchResults.financials, companyName),
      provider.synthesizeQuotes(searchResults.quotes, companyName),
      provider.synthesizeCompetitorMoves(
        searchResults.competitors,
        companyName,
        extractedEntities.competitors
      ),
      provider.synthesizeAnalystCommentary(searchResults.analysts, companyName),
      provider.synthesizePrecedents(
        searchResults.precedents,
        extractedEntities.centralChallenge || `${industry} challenges`
      ),
    ])

    // Synthesize outcome if available
    let outcome: EnrichedResearch['outcome'] | undefined
    if (searchResults.outcome && keyEvent) {
      outcome = await provider.synthesizeOutcome(
        searchResults.outcome,
        companyName,
        keyEvent
      )
    }

    // Build enriched research object
    return {
      financials,
      realQuotes,
      competitorMoves,
      analystPerspectives,
      historicalPrecedents,
      outcome,
      sources: extractSourcesFromSearchResults(
        searchResults.financials,
        searchResults.quotes,
        searchResults.competitors,
        searchResults.analysts,
        searchResults.precedents,
        searchResults.outcome || { query: '', results: [] }
      ),
      enrichmentTimestamp: new Date().toISOString(),
      searchQueries: [
        searchResults.financials.query,
        searchResults.quotes.query,
        searchResults.competitors.query,
        searchResults.analysts.query,
        searchResults.precedents.query,
      ].filter(Boolean),
    }
  } catch (error) {
    // Log but don't fail - enrichment is optional
    if (process.env.NODE_ENV === 'development') {
      console.warn('Research enrichment failed, proceeding without:', error)
    }
    return undefined
  }
}

