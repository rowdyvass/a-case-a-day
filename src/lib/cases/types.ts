import type {
  AIProvider,
  ResearchData,
  CaseContent,
  Exhibit,
  Question,
  ProtagonistProfile,
  EnrichedResearch,
  ContentAnalysis,
  ConceptOption,
} from '@/lib/ai/providers/types'
import type { ValidationResult } from '@/lib/ai/prompts/validation'
import type { SufficiencyResult } from '@/lib/ai/prompts/sufficiency'
import type { CaseGradeResult } from '@/lib/ai/prompts/case-grading'
import type { GenerateCaseInput } from '@/lib/validations/schemas'

/**
 * Context passed through the generation pipeline
 */
export interface GenerationPipelineContext {
  // Input from API request
  input: GenerateCaseInput

  // User info
  userId: string

  // AI provider instance
  provider: AIProvider

  // Detected or provided metadata
  companyName: string
  industry: string
  targetConcepts: string[]

  // Content analysis (if auto-detected)
  analysis?: ContentAnalysis
}

/**
 * Result of the research phase
 */
export interface ResearchPhaseResult {
  researchData: ResearchData
  enrichedResearch?: EnrichedResearch
  sufficiencyResult: SufficiencyResult
}

/**
 * Result of the content generation phase
 */
export interface ContentPhaseResult {
  protagonist?: ProtagonistProfile
  caseContent: CaseContent
}

/**
 * Result of the exhibit generation phase
 */
export interface ExhibitPhaseResult {
  exhibits: Exhibit[]
  varietyScore: number
  warnings: string[]
}

/**
 * Result of the question generation phase
 */
export interface QuestionPhaseResult {
  questions: Question[]
}

/**
 * Result of the validation and grading phase
 */
export interface ValidationPhaseResult {
  validationResult: ValidationResult | null
  gradeResult: CaseGradeResult | null
  finalCaseContent: CaseContent
  finalExhibits: Exhibit[]
  finalQuestions: Question[]
  improvementIterations: number
  requiresReview: boolean
}

/**
 * Result of persisting to database
 */
export interface PersistenceResult {
  caseId: string
  slug: string
  title: string
}

/**
 * Full result of the generation pipeline
 */
export interface GenerationResult {
  id: string
  slug: string
  title: string
  company: string
  industry: string
  concepts: string[]
  protagonist?: {
    name: string
    role: string
  }
  sufficiency: {
    score: number
    level: string
    isAcceptable: boolean
  }
  enrichment?: {
    sourcesCount: number
    realQuotesCount: number
    financialDataPoints: number
    hasOutcomeData: boolean
  }
  validation?: {
    score: number
    confidence: string
    requiresReview: boolean
  }
  grading?: {
    grade: string
    score: number
    isPublishReady: boolean
    improvementIterations: number
  }
}

// Re-export commonly used types
export type {
  AIProvider,
  ResearchData,
  CaseContent,
  Exhibit,
  Question,
  ProtagonistProfile,
  EnrichedResearch,
  ContentAnalysis,
  ConceptOption,
  ValidationResult,
  SufficiencyResult,
  CaseGradeResult,
}

