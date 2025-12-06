export interface ResearchData {
  company: {
    name: string
    description: string
    industry: string
    founded?: string
    headquarters?: string
    employees?: string
    revenue?: string
    marketCap?: string
  }
  financials?: {
    revenue?: string[]
    profitMargin?: string[]
    growthRate?: string
  }
  competitors: {
    name: string
    description: string
  }[]
  marketData?: {
    marketSize?: string
    growthRate?: string
    trends?: string[]
  }
  recentNews?: {
    title: string
    summary: string
  }[]
}

/**
 * Minimal fictional protagonist profile for case studies.
 * Designed for sketch-level profiles that can be established in 2 sentences.
 */
export interface ProtagonistProfile {
  name: string
  role: string
  oneLineDescription: string
  decisionAuthority: string
  personalStakes: string
  keyRelationship: {
    name: string
    role: string
    whyTheyMatter: string
  }
}

export interface CaseContent {
  title: string
  company: string
  industry: string
  summary: string
  protagonist?: ProtagonistProfile
  sections: {
    title: string
    content: string
  }[]
}

/**
 * Standard library exhibit types
 */
export type LibraryExhibitType = 
  | 'table' | 'enhanced_table' | 'data_table' | 'comparison_grid'
  | 'chart' | 'area_chart' | 'stacked_bar' | 'waterfall' | 'funnel'
  | 'treemap' | 'heatmap' | 'radar' | 'positioning' | 'bubble'
  | 'combo' | 'slope' | 'lollipop' | 'donut' | 'histogram'
  | 'candlestick' | 'dumbbell' | 'gauge' | 'bullet'
  | 'timeline' | 'sankey' | 'process_flow' | 'drilldown'
  | 'quote' | 'quote_comparison' | 'callout' | 'stat_highlight'
  | 'source_excerpt' | 'pro_con'
  | 'metric_card' | 'metric_grid' | 'scenario_calculator'
  | 'diagram'

/**
 * Custom AI-generated exhibit type
 */
export type CustomExhibitType = 'custom_interactive'

/**
 * All exhibit types
 */
export type ExhibitType = LibraryExhibitType | CustomExhibitType

/**
 * Data structure for custom interactive exhibits
 */
export interface CustomExhibitData {
  schemaVersion: 1
  description: string
  interactivityType: 'calculator' | 'simulation' | 'visualization' | 'gamified' | 'exploration'
  html: string
  css: string
  js: string
  initialState?: Record<string, unknown>
  accessibilityDescription?: string
}

export interface Exhibit {
  type: ExhibitType
  title: string
  description?: string  // Brief explanation of what the exhibit shows
  narrativeAnchor?: string  // The sentence from the case where this exhibit should appear
  insightDelivered?: string  // What the reader learns that text alone couldn't convey
  dataSourceAttribution?: string  // Realistic source citation for the data
  data: Record<string, unknown> | CustomExhibitData
}

/**
 * Question types for case studies
 */
export type QuestionType = 'multiple_choice' | 'free_text' | 'ranking' | 'framework_application'

/**
 * Grading rubric criteria for AI grading
 */
export interface GradingRubric {
  criteria: {
    name: string
    description: string
    weight: number // 1-10
  }[]
  keyPoints: string[] // Key points that should be mentioned
}

/**
 * Base question structure
 */
export interface QuestionBase {
  text: string
  type: QuestionType
  difficulty: 'easy' | 'medium' | 'hard'
  exemplaryAnswer: string // Model answer shown after submission
}

/**
 * Multiple choice question
 */
export interface MultipleChoiceQuestion extends QuestionBase {
  type: 'multiple_choice'
  options: string[] // Array of answer choices
  correctAnswer: number // Index of correct option (0-based)
}

/**
 * Free text / short answer question
 */
export interface FreeTextQuestion extends QuestionBase {
  type: 'free_text'
  rubric: GradingRubric // Criteria for AI grading
}

/**
 * Ranking / ordering question
 */
export interface RankingQuestion extends QuestionBase {
  type: 'ranking'
  options: string[] // Items to rank
  correctAnswer: number[] // Correct order (indices)
}

/**
 * Framework application question
 */
export interface FrameworkQuestion extends QuestionBase {
  type: 'framework_application'
  frameworkType: string // Which MBA framework to apply
  rubric: GradingRubric // Criteria for AI grading
  promptFields?: { // Optional structured fields for the response
    name: string
    placeholder: string
  }[]
}

/**
 * Union type for all question types
 */
export type Question = MultipleChoiceQuestion | FreeTextQuestion | RankingQuestion | FrameworkQuestion

/**
 * Legacy question format (for backwards compatibility)
 */
export interface LegacyQuestion {
  text: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface GenerationContext {
  sourceArticle: string
  learningObjectives?: string
  targetConcepts?: string[]
  additionalGuidance?: string
  protagonist?: ProtagonistProfile
}

/**
 * Result of content analysis for auto-detection
 */
export interface ContentAnalysis {
  company: {
    name: string
    secondaryCompanies: string[]
  }
  industry: {
    primary: string
    subSector: string | null
  }
  recommendedConcepts: {
    name: string
    relevance: string
  }[]
  learningObjectives: string[]
  summary: string
  confidence: {
    company: 'high' | 'medium' | 'low'
    industry: 'high' | 'medium' | 'low'
    concepts: 'high' | 'medium' | 'low'
  }
}

/**
 * Concept option for analysis
 */
export interface ConceptOption {
  name: string
  category: string
}

// Import and re-export VarietyGuidance from variety.ts for use in AIProvider interface
import type { VarietyGuidance as ImportedVarietyGuidance } from '../../exhibits/variety'
export type VarietyGuidance = ImportedVarietyGuidance

// Import and re-export RecentNamesContext from protagonists for use in AIProvider interface
import type { RecentNamesContext as ImportedRecentNamesContext } from '../../protagonists'
export type RecentNamesContext = ImportedRecentNamesContext

/**
 * Criteria for bulk case research
 */
export interface BulkResearchCriteria {
  company?: string
  concept?: string
  path?: string
  year?: number
  count?: number
}

/**
 * A suggested case idea from bulk research
 */
export interface CaseIdea {
  title: string
  company: string
  industry: string
  description: string
  year: number
  concepts: string[]
  suggestedSources: {
    publication: string
    topic: string
    searchQuery: string
  }[]
  whyGreatCase: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

/**
 * Result of bulk case research
 */
export interface BulkResearchResult {
  caseIdeas: CaseIdea[]
}

// Import grading types
import type { GradingInput, GradingResult } from '../prompts/grading'
export type { GradingInput, GradingResult }

// Import enrichment types
import type { ExtractedEntities } from '../prompts/entity-extraction'
import type { EnrichedResearch, SearchResponse } from './web-research'
import type { ValidationResult } from '../prompts/validation'
export type { ExtractedEntities, EnrichedResearch, SearchResponse, ValidationResult }

// Import case grading types
import type { CaseGradeResult } from '../prompts/case-grading'
export type { CaseGradeResult }

// Import sufficiency types
import type { SufficiencyResult } from '../prompts/sufficiency'
export type { SufficiencyResult }

export interface AIProvider {
  name: string
  
  analyzeContent(
    content: string,
    availableConcepts: ConceptOption[]
  ): Promise<ContentAnalysis>
  
  researchCompany(companyName: string, industry: string): Promise<ResearchData>
  
  researchCaseIdeas(criteria: BulkResearchCriteria): Promise<BulkResearchResult>
  
  generateProtagonist(
    companyName: string,
    industry: string,
    situationSummary: string,
    researchData: ResearchData,
    recentNames?: RecentNamesContext
  ): Promise<ProtagonistProfile>
  
  generateCase(
    context: GenerationContext,
    researchData: ResearchData,
    enrichedResearch?: EnrichedResearch
  ): Promise<CaseContent>
  
  generateExhibits(
    caseContent: CaseContent,
    varietyGuidance?: VarietyGuidance
  ): Promise<Exhibit[]>
  
  generateQuestions(
    caseContent: CaseContent,
    concepts: string[]
  ): Promise<Question[]>
  
  gradeResponse(input: GradingInput): Promise<GradingResult>
  
  // Enrichment methods
  extractEntities(sourceArticle: string): Promise<ExtractedEntities>
  
  synthesizeFinancials(searchResults: SearchResponse, companyName: string): Promise<EnrichedResearch['financials']>
  
  synthesizeQuotes(searchResults: SearchResponse, companyName: string): Promise<EnrichedResearch['realQuotes']>
  
  synthesizeCompetitorMoves(
    searchResults: SearchResponse, 
    companyName: string, 
    competitors: string[]
  ): Promise<EnrichedResearch['competitorMoves']>
  
  synthesizeAnalystCommentary(searchResults: SearchResponse, companyName: string): Promise<EnrichedResearch['analystPerspectives']>
  
  synthesizePrecedents(searchResults: SearchResponse, situation: string): Promise<EnrichedResearch['historicalPrecedents']>
  
  synthesizeOutcome(
    searchResults: SearchResponse, 
    companyName: string, 
    event: string
  ): Promise<EnrichedResearch['outcome']>
  
  validateCase(
    caseContent: CaseContent,
    sourceArticle: string,
    enrichedResearch?: EnrichedResearch
  ): Promise<ValidationResult>
  
  // Case quality grading
  gradeCase(
    caseContent: CaseContent,
    exhibits: Exhibit[],
    questions: Question[]
  ): Promise<CaseGradeResult>
  
  // Improve a specific aspect of the case
  improveCase(
    caseContent: CaseContent,
    gradeResult: CaseGradeResult,
    targetCategory: string
  ): Promise<CaseContent>
}

export type ProviderType = 'openai' | 'anthropic'

