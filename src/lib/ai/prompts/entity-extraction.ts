/**
 * Entity Extraction Prompt
 * 
 * Extracts searchable entities from source articles to enable
 * targeted web research for case enrichment.
 */

export interface ExtractedEntities {
  // Primary company being discussed
  primaryCompany: string
  
  // Other companies mentioned
  secondaryCompanies: string[]
  
  // Named executives with their titles
  executives: {
    name: string
    title: string
    company: string
  }[]
  
  // Competitor companies
  competitors: string[]
  
  // Key events with approximate dates
  keyEvents: {
    event: string
    date?: string
    isPast: boolean // Whether this event has already happened
  }[]
  
  // Industry classification
  industry: string
  
  // Searchable keywords and phrases
  keywords: string[]
  
  // The central challenge or situation
  centralChallenge: string
}

export const ENTITY_EXTRACTION_SYSTEM_PROMPT = `You are an expert at extracting structured information from business articles. Your task is to identify key entities that can be used to research additional context for MBA case study creation.

Focus on extracting:
1. Company names (primary and secondary)
2. Executive names and their titles
3. Competitor companies
4. Key events and their dates
5. Industry classification
6. Searchable keywords

Be precise and only extract what is explicitly mentioned or strongly implied in the text.`

export function getEntityExtractionPrompt(sourceArticle: string): string {
  return `Extract searchable entities from the following business article.

ARTICLE:
---
${sourceArticle.slice(0, 15000)}
---

Extract the following information:

1. PRIMARY COMPANY
   - The main company this article is about
   - Use the official company name (e.g., "Apple Inc." not "Apple")

2. SECONDARY COMPANIES
   - Other companies mentioned in the article
   - Include partners, customers, suppliers, or companies involved in the story

3. EXECUTIVES
   - Named individuals with their job titles
   - Include executives from all mentioned companies
   - Format: Name, Title, Company

4. COMPETITORS
   - Companies that compete with the primary company
   - Include both direct and indirect competitors mentioned

5. KEY EVENTS
   - Significant events described in the article
   - Include dates if mentioned (even approximate like "Q3 2024" or "last year")
   - Mark whether the event has already happened or is anticipated

6. INDUSTRY
   - The primary industry of the main company
   - Be specific (e.g., "Electric Vehicles" not just "Automotive")

7. KEYWORDS
   - Important terms, product names, strategies, or concepts mentioned
   - These will be used for web searches
   - Include: product names, technology terms, strategy concepts, market segments

8. CENTRAL CHALLENGE
   - The main business challenge, decision, or situation described
   - Summarize in 1-2 sentences
   - This will be used to search for historical precedents

Respond in JSON format:
{
  "primaryCompany": "Company Name",
  "secondaryCompanies": ["Company 1", "Company 2"],
  "executives": [
    {
      "name": "Full Name",
      "title": "Job Title",
      "company": "Company Name"
    }
  ],
  "competitors": ["Competitor 1", "Competitor 2"],
  "keyEvents": [
    {
      "event": "Description of event",
      "date": "Date or null if not mentioned",
      "isPast": true
    }
  ],
  "industry": "Industry Name",
  "keywords": ["keyword1", "keyword2", "product name", "strategy term"],
  "centralChallenge": "Brief description of the main challenge or decision"
}`
}

/**
 * Parse the entity extraction response
 */
export function parseEntityExtractionResponse(response: string): ExtractedEntities {
  try {
    // Find JSON in the response
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }
    
    const parsed = JSON.parse(jsonMatch[0])
    
    // Validate and provide defaults
    return {
      primaryCompany: parsed.primaryCompany || 'Unknown Company',
      secondaryCompanies: Array.isArray(parsed.secondaryCompanies) 
        ? parsed.secondaryCompanies 
        : [],
      executives: Array.isArray(parsed.executives) 
        ? parsed.executives.map((e: Record<string, string>) => ({
            name: e.name || 'Unknown',
            title: e.title || 'Executive',
            company: e.company || parsed.primaryCompany || 'Unknown'
          }))
        : [],
      competitors: Array.isArray(parsed.competitors) 
        ? parsed.competitors 
        : [],
      keyEvents: Array.isArray(parsed.keyEvents)
        ? parsed.keyEvents.map((e: Record<string, unknown>) => ({
            event: String(e.event || ''),
            date: e.date ? String(e.date) : undefined,
            isPast: Boolean(e.isPast ?? true)
          }))
        : [],
      industry: parsed.industry || 'Business',
      keywords: Array.isArray(parsed.keywords) 
        ? parsed.keywords 
        : [],
      centralChallenge: parsed.centralChallenge || ''
    }
  } catch (error) {
    console.error('Failed to parse entity extraction response:', error)
    throw new Error('Failed to parse entity extraction response')
  }
}


