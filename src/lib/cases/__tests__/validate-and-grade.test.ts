import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runValidationAndGradingPhase } from '../validate-and-grade'
import { mockAIProvider, mockResponses, resetAIProviderMocks } from '@/__mocks__/ai-provider'

// Mock validation helpers
vi.mock('@/lib/ai/prompts/validation', () => ({
  getValidationSummary: vi.fn(() => 'Validation: 85/100'),
  requiresHumanReview: vi.fn(() => false),
}))

// Mock grading helpers
vi.mock('@/lib/ai/prompts/case-grading', () => ({
  getGradeSummary: vi.fn(() => 'Grade: A- (91/100)'),
  shouldImprove: vi.fn(() => false),
  MAX_IMPROVEMENT_ITERATIONS: 3,
}))

describe('runValidationAndGradingPhase', () => {
  beforeEach(async () => {
    resetAIProviderMocks()
    vi.clearAllMocks()
    
    // Reset mocks to default values
    const { requiresHumanReview } = await import('@/lib/ai/prompts/validation')
    ;(requiresHumanReview as ReturnType<typeof vi.fn>).mockReturnValue(false)
    
    const { shouldImprove } = await import('@/lib/ai/prompts/case-grading')
    ;(shouldImprove as ReturnType<typeof vi.fn>).mockReturnValue(false)
  })

  it('should validate and grade case', async () => {
    const result = await runValidationAndGradingPhase(
      mockAIProvider,
      mockResponses.caseContent,
      mockResponses.exhibits,
      mockResponses.questions,
      'Source article content',
      undefined
    )

    expect(result.validationResult).toEqual(mockResponses.validationResult)
    expect(result.gradeResult).toEqual(mockResponses.gradeResult)
    expect(result.finalCaseContent).toEqual(mockResponses.caseContent)
    expect(result.improvementIterations).toBe(0)
  })

  it('should call validateCase with correct parameters', async () => {
    const enrichedResearch = {
      financials: [],
      realQuotes: [],
      competitorMoves: [],
      analystPerspectives: [],
      historicalPrecedents: [],
      outcome: undefined,
      sources: [],
      enrichmentTimestamp: '2024-01-01T00:00:00Z',
      searchQueries: [],
    }

    await runValidationAndGradingPhase(
      mockAIProvider,
      mockResponses.caseContent,
      mockResponses.exhibits,
      mockResponses.questions,
      'Source article',
      enrichedResearch
    )

    expect(mockAIProvider.validateCase).toHaveBeenCalledWith(
      mockResponses.caseContent,
      'Source article',
      enrichedResearch
    )
  })

  it('should call gradeCase with case, exhibits, and questions', async () => {
    await runValidationAndGradingPhase(
      mockAIProvider,
      mockResponses.caseContent,
      mockResponses.exhibits,
      mockResponses.questions,
      'Source article',
      undefined
    )

    expect(mockAIProvider.gradeCase).toHaveBeenCalledWith(
      mockResponses.caseContent,
      mockResponses.exhibits,
      mockResponses.questions
    )
  })

  describe('when validation fails', () => {
    it('should continue with null validation result', async () => {
      mockAIProvider.validateCase = vi.fn().mockRejectedValue(new Error('Validation error'))

      const result = await runValidationAndGradingPhase(
        mockAIProvider,
        mockResponses.caseContent,
        mockResponses.exhibits,
        mockResponses.questions,
        'Source article',
        undefined
      )

      expect(result.validationResult).toBeNull()
      expect(result.gradeResult).toBeDefined() // Grading should still run
    })
  })

  describe('when grading fails', () => {
    it('should continue with null grade result', async () => {
      mockAIProvider.gradeCase = vi.fn().mockRejectedValue(new Error('Grading error'))

      const result = await runValidationAndGradingPhase(
        mockAIProvider,
        mockResponses.caseContent,
        mockResponses.exhibits,
        mockResponses.questions,
        'Source article',
        undefined
      )

      expect(result.gradeResult).toBeNull()
      expect(result.improvementIterations).toBe(0)
    })
  })

  describe('improvement loop', () => {
    it('should not improve when grade is acceptable', async () => {
      const { shouldImprove } = await import('@/lib/ai/prompts/case-grading')
      ;(shouldImprove as ReturnType<typeof vi.fn>).mockReturnValue(false)

      await runValidationAndGradingPhase(
        mockAIProvider,
        mockResponses.caseContent,
        mockResponses.exhibits,
        mockResponses.questions,
        'Source article',
        undefined
      )

      expect(mockAIProvider.improveCase).not.toHaveBeenCalled()
    })

    it('should run improvement loop when grade is below threshold', async () => {
      const { shouldImprove } = await import('@/lib/ai/prompts/case-grading')
      let callCount = 0
      ;(shouldImprove as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++
        return callCount === 1 // Only improve once
      })

      const improvedContent = {
        ...mockResponses.caseContent,
        title: 'Improved Case',
      }
      mockAIProvider.improveCase = vi.fn().mockResolvedValue(improvedContent)
      mockAIProvider.gradeCase = vi
        .fn()
        .mockResolvedValueOnce({
          ...mockResponses.gradeResult,
          score: 85,
          isPublishReady: false,
        })
        .mockResolvedValueOnce({
          ...mockResponses.gradeResult,
          score: 92,
          isPublishReady: true,
        })

      const result = await runValidationAndGradingPhase(
        mockAIProvider,
        mockResponses.caseContent,
        mockResponses.exhibits,
        mockResponses.questions,
        'Source article',
        undefined
      )

      expect(mockAIProvider.improveCase).toHaveBeenCalledTimes(1)
      expect(result.improvementIterations).toBe(1)
    })

    it('should stop improvement if score does not improve', async () => {
      const { shouldImprove } = await import('@/lib/ai/prompts/case-grading')
      ;(shouldImprove as ReturnType<typeof vi.fn>).mockReturnValue(true)

      const lowerGrade = {
        ...mockResponses.gradeResult,
        score: 80,
      }
      mockAIProvider.gradeCase = vi.fn().mockResolvedValue(lowerGrade)
      mockAIProvider.improveCase = vi.fn().mockResolvedValue(mockResponses.caseContent)

      const result = await runValidationAndGradingPhase(
        mockAIProvider,
        mockResponses.caseContent,
        mockResponses.exhibits,
        mockResponses.questions,
        'Source article',
        undefined
      )

      // Should only try once and stop when score doesn't improve
      expect(mockAIProvider.improveCase).toHaveBeenCalledTimes(1)
      expect(result.improvementIterations).toBe(1)
    })
  })

  describe('requiresReview flag', () => {
    it('should set requiresReview when validation requires review', async () => {
      const { requiresHumanReview } = await import('@/lib/ai/prompts/validation')
      ;(requiresHumanReview as ReturnType<typeof vi.fn>).mockReturnValue(true)

      const result = await runValidationAndGradingPhase(
        mockAIProvider,
        mockResponses.caseContent,
        mockResponses.exhibits,
        mockResponses.questions,
        'Source article',
        undefined
      )

      expect(result.requiresReview).toBe(true)
    })

    it('should set requiresReview when grade is not publish ready', async () => {
      mockAIProvider.gradeCase = vi.fn().mockResolvedValue({
        ...mockResponses.gradeResult,
        isPublishReady: false,
      })

      const result = await runValidationAndGradingPhase(
        mockAIProvider,
        mockResponses.caseContent,
        mockResponses.exhibits,
        mockResponses.questions,
        'Source article',
        undefined
      )

      expect(result.requiresReview).toBe(true)
    })

    it('should not set requiresReview when both pass', async () => {
      const result = await runValidationAndGradingPhase(
        mockAIProvider,
        mockResponses.caseContent,
        mockResponses.exhibits,
        mockResponses.questions,
        'Source article',
        undefined
      )

      expect(result.requiresReview).toBe(false)
    })
  })
})

