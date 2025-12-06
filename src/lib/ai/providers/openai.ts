import OpenAI from 'openai'
import type { 
  AIProvider, 
  ResearchData, 
  CaseContent, 
  Exhibit, 
  Question, 
  GenerationContext,
  ContentAnalysis,
  ConceptOption,
  BulkResearchCriteria,
  BulkResearchResult,
  ProtagonistProfile,
  GradingInput,
  GradingResult,
  ExtractedEntities,
  EnrichedResearch,
  SearchResponse,
  ValidationResult
} from './types'
import type { VarietyGuidance } from '../../exhibits/variety'
import type { RecentNamesContext } from '../../protagonists'
import { RESEARCH_SYSTEM_PROMPT, getResearchPrompt } from '../prompts/research'
import { CASE_SYSTEM_PROMPT, getCaseGenerationPrompt } from '../prompts/case'
import { EXHIBITS_SYSTEM_PROMPT, getExhibitsPrompt } from '../prompts/exhibits'
import { QUESTIONS_SYSTEM_PROMPT, getQuestionsPrompt } from '../prompts/questions'
import { ANALYZE_SYSTEM_PROMPT, getAnalyzePrompt } from '../prompts/analyze'
import { BULK_RESEARCH_SYSTEM_PROMPT, getBulkResearchPrompt } from '../prompts/bulk-research'
import { PROTAGONIST_SYSTEM_PROMPT, getProtagonistPrompt } from '../prompts/protagonist'
import { GRADING_SYSTEM_PROMPT, getGradingPrompt } from '../prompts/grading'
import { 
  ENTITY_EXTRACTION_SYSTEM_PROMPT, 
  getEntityExtractionPrompt,
  parseEntityExtractionResponse 
} from '../prompts/entity-extraction'
import {
  ENRICHMENT_SYNTHESIS_SYSTEM_PROMPT,
  getFinancialsSynthesisPrompt,
  getQuotesSynthesisPrompt,
  getCompetitorSynthesisPrompt,
  getAnalystSynthesisPrompt,
  getPrecedentsSynthesisPrompt,
  getOutcomeSynthesisPrompt,
  parseFinancialsResponse,
  parseQuotesResponse,
  parseCompetitorResponse,
  parseAnalystResponse,
  parsePrecedentsResponse,
  parseOutcomeResponse
} from '../prompts/enrichment'
import {
  VALIDATION_SYSTEM_PROMPT,
  getValidationPrompt,
  parseValidationResponse
} from '../prompts/validation'

export class OpenAIProvider implements AIProvider {
  name = 'openai'
  private client: OpenAI

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }

  private async chat(systemPrompt: string, userPrompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    return response.choices[0].message.content || '{}'
  }

  async analyzeContent(
    content: string,
    availableConcepts: ConceptOption[]
  ): Promise<ContentAnalysis> {
    const prompt = getAnalyzePrompt(content, availableConcepts)
    const response = await this.chat(ANALYZE_SYSTEM_PROMPT, prompt)
    
    try {
      return JSON.parse(response) as ContentAnalysis
    } catch {
      console.error('Failed to parse analysis response:', response)
      throw new Error('Failed to parse content analysis from OpenAI')
    }
  }

  async researchCompany(companyName: string, industry: string): Promise<ResearchData> {
    const prompt = getResearchPrompt(companyName, industry)
    const response = await this.chat(RESEARCH_SYSTEM_PROMPT, prompt)
    
    try {
      return JSON.parse(response) as ResearchData
    } catch {
      console.error('Failed to parse research response:', response)
      throw new Error('Failed to parse research data from OpenAI')
    }
  }

  async researchCaseIdeas(criteria: BulkResearchCriteria): Promise<BulkResearchResult> {
    const prompt = getBulkResearchPrompt(criteria)
    const response = await this.chat(BULK_RESEARCH_SYSTEM_PROMPT, prompt)
    
    try {
      return JSON.parse(response) as BulkResearchResult
    } catch {
      console.error('Failed to parse bulk research response:', response)
      throw new Error('Failed to parse case ideas from OpenAI')
    }
  }

  async generateProtagonist(
    companyName: string,
    industry: string,
    situationSummary: string,
    researchData: ResearchData,
    recentNames?: RecentNamesContext
  ): Promise<ProtagonistProfile> {
    const prompt = getProtagonistPrompt(companyName, industry, situationSummary, researchData, recentNames)
    const response = await this.chat(PROTAGONIST_SYSTEM_PROMPT, prompt)
    
    try {
      return JSON.parse(response) as ProtagonistProfile
    } catch {
      console.error('Failed to parse protagonist response:', response)
      throw new Error('Failed to parse protagonist profile from OpenAI')
    }
  }

  async generateCase(
    context: GenerationContext,
    researchData: ResearchData,
    enrichedResearch?: EnrichedResearch
  ): Promise<CaseContent> {
    const prompt = getCaseGenerationPrompt(context, researchData, enrichedResearch)
    const response = await this.chat(CASE_SYSTEM_PROMPT, prompt)
    
    try {
      return JSON.parse(response) as CaseContent
    } catch {
      console.error('Failed to parse case response:', response)
      throw new Error('Failed to parse case content from OpenAI')
    }
  }

  async generateExhibits(
    caseContent: CaseContent,
    varietyGuidance?: VarietyGuidance
  ): Promise<Exhibit[]> {
    const prompt = getExhibitsPrompt(caseContent, varietyGuidance)
    const response = await this.chat(EXHIBITS_SYSTEM_PROMPT, prompt)
    
    try {
      const parsed = JSON.parse(response)
      return parsed.exhibits as Exhibit[]
    } catch {
      console.error('Failed to parse exhibits response:', response)
      throw new Error('Failed to parse exhibits from OpenAI')
    }
  }

  async generateQuestions(
    caseContent: CaseContent,
    concepts: string[]
  ): Promise<Question[]> {
    const prompt = getQuestionsPrompt(caseContent, concepts)
    const response = await this.chat(QUESTIONS_SYSTEM_PROMPT, prompt)
    
    try {
      const parsed = JSON.parse(response)
      return parsed.questions as Question[]
    } catch {
      console.error('Failed to parse questions response:', response)
      throw new Error('Failed to parse questions from OpenAI')
    }
  }

  async gradeResponse(input: GradingInput): Promise<GradingResult> {
    const prompt = getGradingPrompt(input)
    const response = await this.chat(GRADING_SYSTEM_PROMPT, prompt)
    
    try {
      return JSON.parse(response) as GradingResult
    } catch {
      console.error('Failed to parse grading response:', response)
      throw new Error('Failed to parse grading result from OpenAI')
    }
  }

  // ============================================================================
  // Enrichment Methods
  // ============================================================================

  async extractEntities(sourceArticle: string): Promise<ExtractedEntities> {
    const prompt = getEntityExtractionPrompt(sourceArticle)
    const response = await this.chat(ENTITY_EXTRACTION_SYSTEM_PROMPT, prompt)
    return parseEntityExtractionResponse(response)
  }

  async synthesizeFinancials(
    searchResults: SearchResponse, 
    companyName: string
  ): Promise<EnrichedResearch['financials']> {
    if (!searchResults.results.length) return []
    
    const prompt = getFinancialsSynthesisPrompt(searchResults, companyName)
    const response = await this.chat(ENRICHMENT_SYNTHESIS_SYSTEM_PROMPT, prompt)
    return parseFinancialsResponse(response)
  }

  async synthesizeQuotes(
    searchResults: SearchResponse, 
    companyName: string
  ): Promise<EnrichedResearch['realQuotes']> {
    if (!searchResults.results.length) return []
    
    const prompt = getQuotesSynthesisPrompt(searchResults, companyName)
    const response = await this.chat(ENRICHMENT_SYNTHESIS_SYSTEM_PROMPT, prompt)
    return parseQuotesResponse(response)
  }

  async synthesizeCompetitorMoves(
    searchResults: SearchResponse, 
    companyName: string,
    competitors: string[]
  ): Promise<EnrichedResearch['competitorMoves']> {
    if (!searchResults.results.length) return []
    
    const prompt = getCompetitorSynthesisPrompt(searchResults, companyName, competitors)
    const response = await this.chat(ENRICHMENT_SYNTHESIS_SYSTEM_PROMPT, prompt)
    return parseCompetitorResponse(response)
  }

  async synthesizeAnalystCommentary(
    searchResults: SearchResponse, 
    companyName: string
  ): Promise<EnrichedResearch['analystPerspectives']> {
    if (!searchResults.results.length) return []
    
    const prompt = getAnalystSynthesisPrompt(searchResults, companyName)
    const response = await this.chat(ENRICHMENT_SYNTHESIS_SYSTEM_PROMPT, prompt)
    return parseAnalystResponse(response)
  }

  async synthesizePrecedents(
    searchResults: SearchResponse, 
    situation: string
  ): Promise<EnrichedResearch['historicalPrecedents']> {
    if (!searchResults.results.length) return []
    
    const prompt = getPrecedentsSynthesisPrompt(searchResults, situation)
    const response = await this.chat(ENRICHMENT_SYNTHESIS_SYSTEM_PROMPT, prompt)
    return parsePrecedentsResponse(response)
  }

  async synthesizeOutcome(
    searchResults: SearchResponse, 
    companyName: string,
    event: string
  ): Promise<EnrichedResearch['outcome']> {
    if (!searchResults.results.length) return undefined
    
    const prompt = getOutcomeSynthesisPrompt(searchResults, companyName, event)
    const response = await this.chat(ENRICHMENT_SYNTHESIS_SYSTEM_PROMPT, prompt)
    return parseOutcomeResponse(response)
  }

  async validateCase(
    caseContent: CaseContent,
    sourceArticle: string,
    enrichedResearch?: EnrichedResearch
  ): Promise<ValidationResult> {
    const prompt = getValidationPrompt(caseContent, sourceArticle, enrichedResearch)
    const response = await this.chat(VALIDATION_SYSTEM_PROMPT, prompt)
    return parseValidationResponse(response)
  }
}

