/**
 * Case Generation Pipeline
 *
 * This module provides a modular, testable pipeline for generating
 * MBA case studies from source articles.
 *
 * Pipeline phases:
 * 1. Analyze & Detect - Auto-detect company, industry, concepts
 * 2. Research - Company research + web enrichment
 * 3. Generate Content - Protagonist + case narrative
 * 4. Generate Exhibits - Charts, tables, diagrams
 * 5. Generate Questions - Discussion questions
 * 6. Validate & Grade - Quality assurance + improvement loop
 * 7. Persist - Save to database
 */

// Phase modules
export { analyzeAndDetectMetadata, type AnalysisResult } from './analyze'
export { runResearchPhase, researchCompany } from './research'
export { runContentGenerationPhase } from './generate-content'
export { runExhibitGenerationPhase } from './generate-exhibits'
export { runQuestionGenerationPhase } from './generate-questions'
export { runValidationAndGradingPhase } from './validate-and-grade'
export { runIllustrationGenerationPhase, regenerateIllustration, type IllustrationPhaseResult } from './generate-illustration'
export { persistCase } from './persist'

// Shared types
export type {
  GenerationPipelineContext,
  ResearchPhaseResult,
  ContentPhaseResult,
  ExhibitPhaseResult,
  QuestionPhaseResult,
  ValidationPhaseResult,
  PersistenceResult,
  GenerationResult,
} from './types'

// Re-exported AI types for convenience
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
} from './types'

