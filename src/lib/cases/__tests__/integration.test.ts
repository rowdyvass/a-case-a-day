/**
 * Integration tests for the case generation pipeline
 *
 * These tests verify that the pipeline modules work together correctly,
 * while still mocking external dependencies (AI provider, database).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mocks must be hoisted
vi.mock('@/lib/db', () => {
  const createMockModelOperations = () => ({
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    createMany: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    count: vi.fn(),
    aggregate: vi.fn(),
    groupBy: vi.fn(),
  })

  return {
    prisma: {
      concept: createMockModelOperations(),
      case: createMockModelOperations(),
      caseConcept: createMockModelOperations(),
    },
  }
})

import {
  analyzeAndDetectMetadata,
  runResearchPhase,
  runContentGenerationPhase,
  runExhibitGenerationPhase,
  runQuestionGenerationPhase,
  runValidationAndGradingPhase,
  persistCase,
} from '../index'
import { prisma } from '@/lib/db'
import { mockAIProvider, mockResponses, resetAIProviderMocks } from '@/__mocks__/ai-provider'

// Cast for mock access
const mockPrisma = prisma as unknown as {
  concept: { findMany: ReturnType<typeof vi.fn> }
  case: { findUnique: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> }
  caseConcept: { createMany: ReturnType<typeof vi.fn> }
}

// Mock external dependencies
vi.mock('@/lib/ai/providers/web-research', () => ({
  getWebResearchProvider: vi.fn(() => ({
    isAvailable: vi.fn(() => false),
  })),
}))

vi.mock('@/lib/ai/prompts/sufficiency', () => ({
  checkResearchSufficiency: vi.fn(() => ({
    score: 80,
    level: 'full',
    isAcceptable: true,
    adjustments: [],
    details: {},
  })),
  getSufficiencySummary: vi.fn(() => 'Research sufficiency: 80/100'),
}))

vi.mock('@/lib/exhibits/variety', () => ({
  getVarietyGuidance: vi.fn().mockResolvedValue({
    avoidTypes: [],
    freshTypes: ['heatmap'],
    preferredCategories: ['chart'],
    stats: { casesAnalyzed: 5, typeUsage: {} },
  }),
  analyzeExhibitVariety: vi.fn().mockReturnValue({
    score: 85,
    warnings: [],
    suggestions: [],
    uniqueTypes: 4,
    categorySpread: 3,
  }),
  getVarietySummary: vi.fn(() => '85/100'),
}))

vi.mock('@/lib/exhibits/custom-exhibit-schema', () => ({
  validateCustomExhibit: vi.fn().mockReturnValue({
    valid: true,
    errors: [],
    warnings: [],
  }),
}))

vi.mock('@/lib/ai/prompts/validation', () => ({
  getValidationSummary: vi.fn(() => 'Validation passed'),
  requiresHumanReview: vi.fn(() => false),
}))

vi.mock('@/lib/ai/prompts/case-grading', () => ({
  getGradeSummary: vi.fn(() => 'Grade: A-'),
  shouldImprove: vi.fn(() => false),
  MAX_IMPROVEMENT_ITERATIONS: 3,
}))

vi.mock('@/lib/prompts/registry', () => ({
  getAllActivePrompts: vi.fn().mockResolvedValue([]),
  createPromptVersionsJson: vi.fn().mockReturnValue('{}'),
}))

vi.mock('@/lib/utils', () => ({
  slugify: vi.fn((text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  ),
}))

describe('Case Generation Pipeline Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetAIProviderMocks()

    // Set up Prisma mocks
    mockPrisma.concept.findMany.mockResolvedValue([
      { id: 'c1', name: 'SWOT Analysis', category: 'Strategy' },
      { id: 'c2', name: "Porter's Five Forces", category: 'Strategy' },
    ])
    mockPrisma.case.findUnique.mockResolvedValue(null)
    mockPrisma.case.create.mockResolvedValue({
      id: 'case-123',
      slug: 'test-case',
      title: 'Test Case',
    })
    mockPrisma.caseConcept.createMany.mockResolvedValue({ count: 2 })
  })

  describe('full pipeline flow', () => {
    it('should run complete pipeline from analysis to persistence', async () => {
      const sourceArticle = 'A comprehensive article about Acme Corp '.repeat(10)

      // Phase 1: Analyze
      const analysis = await analyzeAndDetectMetadata(mockAIProvider, {
        sourceArticle,
      })
      expect(analysis.companyName).toBeDefined()
      expect(analysis.industry).toBeDefined()
      expect(analysis.targetConcepts.length).toBeGreaterThan(0)

      // Phase 2: Research
      const research = await runResearchPhase(
        mockAIProvider,
        sourceArticle,
        analysis.companyName,
        analysis.industry,
        mockResponses.researchData
      )
      expect(research.researchData).toBeDefined()
      expect(research.sufficiencyResult.isAcceptable).toBe(true)

      // Phase 3: Generate Content
      const content = await runContentGenerationPhase(
        mockAIProvider,
        sourceArticle,
        analysis.companyName,
        analysis.industry,
        research.researchData,
        research.enrichedResearch,
        analysis.targetConcepts
      )
      expect(content.caseContent).toBeDefined()
      expect(content.caseContent.title).toBeDefined()

      // Phase 4: Generate Exhibits
      const exhibits = await runExhibitGenerationPhase(
        mockAIProvider,
        content.caseContent
      )
      expect(exhibits.exhibits.length).toBeGreaterThan(0)

      // Phase 5: Generate Questions
      const questions = await runQuestionGenerationPhase(
        mockAIProvider,
        content.caseContent,
        analysis.targetConcepts
      )
      expect(questions.questions.length).toBeGreaterThan(0)

      // Phase 6: Validate and Grade
      const validation = await runValidationAndGradingPhase(
        mockAIProvider,
        content.caseContent,
        exhibits.exhibits,
        questions.questions,
        sourceArticle,
        research.enrichedResearch
      )
      expect(validation.requiresReview).toBe(false)

      // Phase 7: Persist
      const result = await persistCase({
        userId: 'user-123',
        caseContent: validation.finalCaseContent,
        exhibits: validation.finalExhibits,
        questions: validation.finalQuestions,
        protagonist: content.protagonist,
        companyName: analysis.companyName,
        industry: analysis.industry,
        targetConcepts: analysis.targetConcepts,
        sourceArticle,
        sufficiencyResult: research.sufficiencyResult,
        validationResult: validation.validationResult,
        gradeResult: validation.gradeResult,
        improvementIterations: validation.improvementIterations,
        requiresReview: validation.requiresReview,
      })

      expect(result.caseId).toBe('case-123')
      expect(result.slug).toBeDefined()
    })

    it('should handle pipeline with provided metadata (skip auto-detection)', async () => {
      const sourceArticle = 'Article content '.repeat(20)

      // When all metadata is provided, AI analysis should be skipped
      const analysis = await analyzeAndDetectMetadata(mockAIProvider, {
        sourceArticle,
        companyName: 'Test Corp',
        industry: 'Finance',
        targetConcepts: ['DCF Valuation'],
      })

      expect(analysis.companyName).toBe('Test Corp')
      expect(analysis.industry).toBe('Finance')
      expect(analysis.targetConcepts).toEqual(['DCF Valuation'])
      expect(mockAIProvider.analyzeContent).not.toHaveBeenCalled()
    })

    it('should pass data correctly between phases', async () => {
      const sourceArticle = 'Test article '.repeat(20)

      // Run first few phases
      const analysis = await analyzeAndDetectMetadata(mockAIProvider, {
        sourceArticle,
      })

      const research = await runResearchPhase(
        mockAIProvider,
        sourceArticle,
        analysis.companyName,
        analysis.industry,
        mockResponses.researchData
      )

      // Verify research data is passed to content generation
      await runContentGenerationPhase(
        mockAIProvider,
        sourceArticle,
        analysis.companyName,
        analysis.industry,
        research.researchData,
        research.enrichedResearch,
        analysis.targetConcepts
      )

      expect(mockAIProvider.generateCase).toHaveBeenCalledWith(
        expect.objectContaining({
          sourceArticle,
          targetConcepts: analysis.targetConcepts,
        }),
        research.researchData,
        research.enrichedResearch
      )
    })
  })

  describe('error recovery', () => {
    it('should continue when protagonist generation fails', async () => {
      mockAIProvider.generateProtagonist = vi.fn().mockRejectedValue(new Error('AI error'))

      const content = await runContentGenerationPhase(
        mockAIProvider,
        'Test article',
        'Acme Corp',
        'Technology',
        mockResponses.researchData,
        undefined,
        ['Strategy']
      )

      // Should still have case content, just no protagonist
      expect(content.caseContent).toBeDefined()
      expect(content.protagonist).toBeUndefined()
    })

    it('should continue when validation fails', async () => {
      mockAIProvider.validateCase = vi.fn().mockRejectedValue(new Error('Validation error'))

      const validation = await runValidationAndGradingPhase(
        mockAIProvider,
        mockResponses.caseContent,
        mockResponses.exhibits,
        mockResponses.questions,
        'Source article',
        undefined
      )

      expect(validation.validationResult).toBeNull()
      expect(validation.gradeResult).toBeDefined()
    })

    it('should continue when grading fails', async () => {
      mockAIProvider.gradeCase = vi.fn().mockRejectedValue(new Error('Grading error'))

      const validation = await runValidationAndGradingPhase(
        mockAIProvider,
        mockResponses.caseContent,
        mockResponses.exhibits,
        mockResponses.questions,
        'Source article',
        undefined
      )

      expect(validation.gradeResult).toBeNull()
      expect(validation.finalCaseContent).toBeDefined()
    })
  })
})

