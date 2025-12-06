import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runContentGenerationPhase } from '../generate-content'
import { mockAIProvider, mockResponses, resetAIProviderMocks } from '@/__mocks__/ai-provider'

describe('runContentGenerationPhase', () => {
  beforeEach(() => {
    resetAIProviderMocks()
  })

  it('should generate protagonist and case content', async () => {
    const result = await runContentGenerationPhase(
      mockAIProvider,
      'Test article content '.repeat(100),
      'Acme Corp',
      'Technology',
      mockResponses.researchData,
      undefined, // No enriched research
      ["Porter's Five Forces", 'SWOT Analysis'],
      'Learn strategic analysis',
      'Focus on competition'
    )

    expect(result.protagonist).toEqual(mockResponses.protagonist)
    expect(result.caseContent).toEqual(mockResponses.caseContent)
  })

  it('should call generateProtagonist with correct parameters', async () => {
    const sourceArticle = 'Test article content '.repeat(200)

    await runContentGenerationPhase(
      mockAIProvider,
      sourceArticle,
      'Test Corp',
      'Finance',
      mockResponses.researchData,
      undefined,
      ['DCF Valuation'],
      undefined,
      undefined
    )

    expect(mockAIProvider.generateProtagonist).toHaveBeenCalledWith(
      'Test Corp',
      'Finance',
      expect.any(String), // situationSummary (first 2000 chars)
      mockResponses.researchData
    )

    // Verify situationSummary is truncated to 2000 chars
    const call = (mockAIProvider.generateProtagonist as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(call[2].length).toBeLessThanOrEqual(2000)
  })

  it('should call generateCase with correct context', async () => {
    await runContentGenerationPhase(
      mockAIProvider,
      'Test article',
      'Acme Corp',
      'Technology',
      mockResponses.researchData,
      undefined,
      ['SWOT Analysis'],
      'Learning objectives here',
      'Additional guidance here'
    )

    expect(mockAIProvider.generateCase).toHaveBeenCalledWith(
      expect.objectContaining({
        sourceArticle: 'Test article',
        learningObjectives: 'Learning objectives here',
        targetConcepts: ['SWOT Analysis'],
        additionalGuidance: 'Additional guidance here',
        protagonist: mockResponses.protagonist,
      }),
      mockResponses.researchData,
      undefined
    )
  })

  it('should pass enriched research when available', async () => {
    const mockEnrichedResearch = {
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

    await runContentGenerationPhase(
      mockAIProvider,
      'Test article',
      'Acme Corp',
      'Technology',
      mockResponses.researchData,
      mockEnrichedResearch,
      ['SWOT Analysis']
    )

    expect(mockAIProvider.generateCase).toHaveBeenCalledWith(
      expect.any(Object),
      mockResponses.researchData,
      mockEnrichedResearch
    )
  })

  describe('when protagonist generation fails', () => {
    it('should continue without protagonist', async () => {
      mockAIProvider.generateProtagonist = vi.fn().mockRejectedValue(new Error('AI error'))

      const result = await runContentGenerationPhase(
        mockAIProvider,
        'Test article',
        'Acme Corp',
        'Technology',
        mockResponses.researchData,
        undefined,
        ['SWOT Analysis']
      )

      expect(result.protagonist).toBeUndefined()
      expect(result.caseContent).toBeDefined()
      // generateCase should still be called, with undefined protagonist
      expect(mockAIProvider.generateCase).toHaveBeenCalledWith(
        expect.objectContaining({
          protagonist: undefined,
        }),
        mockResponses.researchData,
        undefined
      )
    })
  })

  describe('edge cases', () => {
    it('should handle empty targetConcepts', async () => {
      const result = await runContentGenerationPhase(
        mockAIProvider,
        'Test article',
        'Acme Corp',
        'Technology',
        mockResponses.researchData,
        undefined,
        []
      )

      expect(result.caseContent).toBeDefined()
    })

    it('should handle undefined optional parameters', async () => {
      const result = await runContentGenerationPhase(
        mockAIProvider,
        'Test article',
        'Acme Corp',
        'Technology',
        mockResponses.researchData,
        undefined,
        ['SWOT Analysis'],
        undefined, // learningObjectives
        undefined // additionalGuidance
      )

      expect(result.caseContent).toBeDefined()
      expect(mockAIProvider.generateCase).toHaveBeenCalledWith(
        expect.objectContaining({
          learningObjectives: undefined,
          additionalGuidance: undefined,
        }),
        mockResponses.researchData,
        undefined
      )
    })
  })
})

