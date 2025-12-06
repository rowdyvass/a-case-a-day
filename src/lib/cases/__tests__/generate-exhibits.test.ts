import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runExhibitGenerationPhase } from '../generate-exhibits'
import { mockAIProvider, mockResponses, resetAIProviderMocks } from '@/__mocks__/ai-provider'

// Mock variety guidance
vi.mock('@/lib/exhibits/variety', () => ({
  getVarietyGuidance: vi.fn().mockResolvedValue({
    avoidTypes: [],
    freshTypes: ['heatmap', 'sankey'],
    preferredCategories: ['chart', 'table'],
    stats: {
      casesAnalyzed: 5,
      typeUsage: {},
    },
  }),
  analyzeExhibitVariety: vi.fn().mockReturnValue({
    score: 85,
    warnings: [],
    suggestions: ['Consider adding more interactive exhibits'],
    uniqueTypes: 4,
    categorySpread: 3,
  }),
  getVarietySummary: vi.fn().mockReturnValue('85/100 - Good variety'),
}))

// Mock exhibit validation
vi.mock('@/lib/exhibits/custom-exhibit-schema', () => ({
  validateCustomExhibit: vi.fn().mockReturnValue({
    valid: true,
    errors: [],
    warnings: [],
  }),
}))

describe('runExhibitGenerationPhase', () => {
  beforeEach(() => {
    resetAIProviderMocks()
    vi.clearAllMocks()
  })

  it('should generate exhibits with variety guidance', async () => {
    const result = await runExhibitGenerationPhase(
      mockAIProvider,
      mockResponses.caseContent
    )

    expect(result.exhibits).toEqual(mockResponses.exhibits)
    expect(result.varietyScore).toBe(85)
    expect(result.warnings).toEqual([])
  })

  it('should pass variety guidance to AI provider', async () => {
    await runExhibitGenerationPhase(mockAIProvider, mockResponses.caseContent)

    expect(mockAIProvider.generateExhibits).toHaveBeenCalledWith(
      mockResponses.caseContent,
      expect.objectContaining({
        avoidTypes: [],
        freshTypes: ['heatmap', 'sankey'],
      })
    )
  })

  it('should analyze variety of generated exhibits', async () => {
    const { analyzeExhibitVariety } = await import('@/lib/exhibits/variety')

    await runExhibitGenerationPhase(mockAIProvider, mockResponses.caseContent)

    expect(analyzeExhibitVariety).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ type: 'chart', title: 'Revenue Growth' }),
      ]),
      expect.any(Object)
    )
  })

  describe('custom exhibit validation', () => {
    it('should filter out invalid custom exhibits', async () => {
      const exhibitsWithInvalid = [
        ...mockResponses.exhibits,
        {
          type: 'custom_interactive',
          title: 'Invalid Exhibit',
          data: { invalid: true },
        },
      ]

      mockAIProvider.generateExhibits = vi.fn().mockResolvedValue(exhibitsWithInvalid)

      const { validateCustomExhibit } = await import('@/lib/exhibits/custom-exhibit-schema')
      ;(validateCustomExhibit as ReturnType<typeof vi.fn>).mockImplementation((data) => {
        if (data.invalid) {
          return { valid: false, errors: ['Invalid data'], warnings: [] }
        }
        return { valid: true, errors: [], warnings: [] }
      })

      const result = await runExhibitGenerationPhase(
        mockAIProvider,
        mockResponses.caseContent
      )

      // Invalid custom exhibit should be filtered out
      expect(result.exhibits.find((e) => e.title === 'Invalid Exhibit')).toBeUndefined()
    })

    it('should pass through library exhibits without validation', async () => {
      const result = await runExhibitGenerationPhase(
        mockAIProvider,
        mockResponses.caseContent
      )

      // Library exhibits (chart, table) should pass through
      expect(result.exhibits.length).toBe(mockResponses.exhibits.length)
    })
  })

  describe('variety warnings', () => {
    it('should include warnings in result', async () => {
      const { analyzeExhibitVariety } = await import('@/lib/exhibits/variety')
      ;(analyzeExhibitVariety as ReturnType<typeof vi.fn>).mockReturnValue({
        score: 60,
        warnings: ['Too many chart types', 'Missing table exhibits'],
        suggestions: [],
        uniqueTypes: 2,
        categorySpread: 1,
      })

      const result = await runExhibitGenerationPhase(
        mockAIProvider,
        mockResponses.caseContent
      )

      expect(result.varietyScore).toBe(60)
      expect(result.warnings).toContain('Too many chart types')
      expect(result.warnings).toContain('Missing table exhibits')
    })
  })
})

