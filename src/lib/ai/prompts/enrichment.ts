/**
 * Enrichment Synthesis Prompt
 * 
 * Synthesizes web search results into structured enrichment data
 * that can be used to improve case study quality.
 */

import type { 
  EnrichedResearch, 
  SearchResponse, 
  AttributedQuote,
  CompetitorInsight,
  AnalystComment,
  HistoricalPrecedent,
  FinancialDataPoint,
  OutcomeData
} from '../providers/web-research'
import type { ExtractedEntities } from './entity-extraction'

export const ENRICHMENT_SYNTHESIS_SYSTEM_PROMPT = `You are an expert business analyst who synthesizes web research into structured data for MBA case studies. Your task is to extract specific, attributable facts from search results.

CRITICAL RULES:
1. Only extract information that is EXPLICITLY stated in the search results
2. Always include the source URL for every piece of information
3. Quote executives EXACTLY - do not paraphrase or combine quotes
4. Include dates whenever available
5. If information is unclear or contradictory, note the uncertainty
6. Prefer recent information over older information
7. Never fabricate or infer information not present in sources`

export function getFinancialsSynthesisPrompt(
  searchResults: SearchResponse,
  companyName: string
): string {
  return `Extract financial data points for ${companyName} from these search results.

SEARCH RESULTS:
${formatSearchResults(searchResults)}

Extract any of the following metrics if mentioned:
- Revenue (annual, quarterly)
- Net income / profit
- Market capitalization
- Stock price
- Growth rates
- Profit margins
- Employee count
- Valuation

For each data point, include:
1. The metric name
2. The exact value (with units)
3. The time period (e.g., "Q3 2024", "FY2023")
4. The source URL

Respond in JSON format:
{
  "financials": [
    {
      "metric": "Revenue",
      "value": "$50.5 billion",
      "period": "Q3 2024",
      "source": "https://..."
    }
  ]
}`
}

export function getQuotesSynthesisPrompt(
  searchResults: SearchResponse,
  companyName: string
): string {
  return `Extract direct quotes from executives and stakeholders about ${companyName}.

SEARCH RESULTS:
${formatSearchResults(searchResults)}

Extract EXACT QUOTES only - do not paraphrase. For each quote include:
1. The exact text of the quote (in quotation marks in the source)
2. The speaker's full name
3. Their role/title
4. The source URL
5. The date (if available)
6. Brief context about what they were discussing

Prioritize:
- CEO and C-suite executive quotes
- Quotes about the company's strategy or challenges
- Quotes that reveal decision-making rationale
- Quotes that show different perspectives

Respond in JSON format:
{
  "quotes": [
    {
      "text": "Exact quote from the source",
      "speaker": "Full Name",
      "role": "CEO of Company",
      "source": "https://...",
      "date": "November 2024",
      "context": "Speaking about the company's AI strategy"
    }
  ]
}`
}

export function getCompetitorSynthesisPrompt(
  searchResults: SearchResponse,
  companyName: string,
  competitors: string[]
): string {
  return `Extract competitor reactions and competitive moves related to ${companyName}.

Known competitors: ${competitors.join(', ')}

SEARCH RESULTS:
${formatSearchResults(searchResults)}

Extract information about:
1. Direct responses or reactions to ${companyName}'s moves
2. Competitive countermoves
3. Market positioning changes
4. Quotes from competitor executives

For each insight include:
1. Competitor name
2. Their reaction or competitive move
3. Source URL
4. Date (if available)

Respond in JSON format:
{
  "competitorMoves": [
    {
      "name": "Competitor Name",
      "reaction": "Description of their response",
      "competitiveMove": "What action they took",
      "source": "https://...",
      "date": "Date if available"
    }
  ]
}`
}

export function getAnalystSynthesisPrompt(
  searchResults: SearchResponse,
  companyName: string
): string {
  return `Extract analyst commentary and ratings for ${companyName}.

SEARCH RESULTS:
${formatSearchResults(searchResults)}

Extract:
1. Analyst ratings (buy/sell/hold)
2. Price targets
3. Analysis of the company's position
4. Expert opinions on strategy

For each comment include:
1. Analyst name (if available)
2. Their firm
3. Rating (if applicable)
4. Their comment or analysis
5. Source URL
6. Date

Respond in JSON format:
{
  "analystComments": [
    {
      "analyst": "Analyst Name or 'Unnamed'",
      "firm": "Goldman Sachs",
      "rating": "Buy",
      "comment": "Their analysis or quote",
      "source": "https://...",
      "date": "Date if available"
    }
  ]
}`
}

export function getPrecedentsSynthesisPrompt(
  searchResults: SearchResponse,
  situation: string
): string {
  return `Find historical precedents - other companies that faced similar situations.

SITUATION: ${situation}

SEARCH RESULTS:
${formatSearchResults(searchResults)}

Extract examples of other companies that faced similar challenges. Include:
1. Company name
2. The situation they faced
3. What happened / the outcome
4. Why this is relevant as a precedent
5. The approximate year
6. Source URL (if from the search results)

Respond in JSON format:
{
  "precedents": [
    {
      "company": "Company Name",
      "situation": "What challenge they faced",
      "outcome": "What happened as a result",
      "relevance": "Why this is a useful comparison",
      "year": 2020,
      "source": "https://... or null if from general knowledge"
    }
  ]
}`
}

export function getOutcomeSynthesisPrompt(
  searchResults: SearchResponse,
  companyName: string,
  event: string
): string {
  return `Extract information about the outcome of ${companyName}'s ${event}.

SEARCH RESULTS:
${formatSearchResults(searchResults)}

Extract:
1. What ultimately happened
2. The timeframe over which it unfolded
3. Key measurable results
4. The main source for this information

Respond in JSON format:
{
  "outcome": {
    "description": "Summary of what happened",
    "timeframe": "e.g., 'Over the following 6 months'",
    "keyResults": [
      "Specific outcome 1",
      "Specific outcome 2"
    ],
    "source": "https://..."
  }
}`
}

// Helper function to format search results for prompts
function formatSearchResults(searchResponse: SearchResponse): string {
  if (!searchResponse.results || searchResponse.results.length === 0) {
    return 'No search results available.'
  }
  
  return searchResponse.results
    .map((result, index) => `
[Result ${index + 1}]
Title: ${result.title}
URL: ${result.url}
${result.publishedDate ? `Date: ${result.publishedDate}` : ''}
Content: ${result.content}
---`)
    .join('\n')
}

/**
 * Parse financial data synthesis response
 */
export function parseFinancialsResponse(response: string): FinancialDataPoint[] {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return []
    
    const parsed = JSON.parse(jsonMatch[0])
    return Array.isArray(parsed.financials) ? parsed.financials : []
  } catch {
    console.error('Failed to parse financials response')
    return []
  }
}

/**
 * Parse quotes synthesis response
 */
export function parseQuotesResponse(response: string): AttributedQuote[] {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return []
    
    const parsed = JSON.parse(jsonMatch[0])
    return Array.isArray(parsed.quotes) ? parsed.quotes : []
  } catch {
    console.error('Failed to parse quotes response')
    return []
  }
}

/**
 * Parse competitor moves synthesis response
 */
export function parseCompetitorResponse(response: string): CompetitorInsight[] {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return []
    
    const parsed = JSON.parse(jsonMatch[0])
    return Array.isArray(parsed.competitorMoves) ? parsed.competitorMoves : []
  } catch {
    console.error('Failed to parse competitor response')
    return []
  }
}

/**
 * Parse analyst commentary synthesis response
 */
export function parseAnalystResponse(response: string): AnalystComment[] {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return []
    
    const parsed = JSON.parse(jsonMatch[0])
    return Array.isArray(parsed.analystComments) ? parsed.analystComments : []
  } catch {
    console.error('Failed to parse analyst response')
    return []
  }
}

/**
 * Parse historical precedents synthesis response
 */
export function parsePrecedentsResponse(response: string): HistoricalPrecedent[] {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return []
    
    const parsed = JSON.parse(jsonMatch[0])
    return Array.isArray(parsed.precedents) ? parsed.precedents : []
  } catch {
    console.error('Failed to parse precedents response')
    return []
  }
}

/**
 * Parse outcome synthesis response
 */
export function parseOutcomeResponse(response: string): OutcomeData | undefined {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return undefined
    
    const parsed = JSON.parse(jsonMatch[0])
    return parsed.outcome || undefined
  } catch {
    console.error('Failed to parse outcome response')
    return undefined
  }
}

/**
 * Create an empty enriched research object
 */
export function createEmptyEnrichedResearch(): EnrichedResearch {
  return {
    financials: [],
    competitorMoves: [],
    realQuotes: [],
    analystPerspectives: [],
    historicalPrecedents: [],
    sources: [],
    enrichmentTimestamp: new Date().toISOString(),
    searchQueries: [],
  }
}

/**
 * Merge search results into sources list
 */
export function extractSourcesFromSearchResults(
  ...searchResponses: SearchResponse[]
): EnrichedResearch['sources'] {
  const seen = new Set<string>()
  const sources: EnrichedResearch['sources'] = []
  
  for (const response of searchResponses) {
    for (const result of response.results || []) {
      if (!seen.has(result.url)) {
        seen.add(result.url)
        sources.push({
          url: result.url,
          title: result.title,
          retrievedAt: new Date().toISOString(),
        })
      }
    }
  }
  
  return sources
}


