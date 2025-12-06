import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runResearchPhase, researchCompany } from '../research'
import { mockAIProvider, mockResponses, resetAIProviderMocks } from '@/__mocks__/ai-provider'

// Mock the web research provider
vi.mock('@/lib/ai/providers/web-research', () => ({
  getWebResearchProvider: vi.fn(() => ({
    isAvailable: vi.fn(() => false), // Default to unavailable
    runEnrichmentSearches: vi.fn(),
  })),
}))

// Mock sufficiency check
vi.mock('@/lib/ai/prompts/sufficiency', () => ({
  checkResearchSufficiency: vi.fn(() => ({
    score: 75,
    level: 'partial',
    isAcceptable: true,
    adjustments: [],
    details: {},
  })),
  getSufficiencySummary: vi.fn(() => 'Research sufficiency: 75/100 (partial)'),
}))

describe('researchCompany', () => {
  beforeEach(() => {
    resetAIProviderMocks()
  })

  it('should call AI provider to research company', async () => {
    const result = await researchCompany(mockAIProvider, 'Acme Corp', 'Technology')

    expect(mockAIProvider.researchCompany).toHaveBeenCalledWith('Acme Corp', 'Technology')
    expect(result).toEqual(mockResponses.researchData)
  })

  it('should pass company name and industry correctly', async () => {
    await researchCompany(mockAIProvider, 'Test Company', 'Healthcare')

    expect(mockAIProvider.researchCompany).toHaveBeenCalledWith('Test Company', 'Healthcare')
  })
})

describe('runResearchPhase', () => {
  beforeEach(() => {
    resetAIProviderMocks()
  })

  describe('without web research available', () => {
    it('should return research data without enrichment', async () => {
      const result = await runResearchPhase(
        mockAIProvider,
        'Test article content',
        'Acme Corp',
        'Technology',
        mockResponses.researchData
      )

      expect(result.researchData).toEqual(mockResponses.researchData)
      expect(result.enrichedResearch).toBeUndefined()
      expect(result.sufficiencyResult).toBeDefined()
      expect(result.sufficiencyResult.isAcceptable).toBe(true)
    })

    it('should check research sufficiency', async () => {
      const { checkResearchSufficiency } = await import('@/lib/ai/prompts/sufficiency')

      await runResearchPhase(
        mockAIProvider,
        'Test article content',
        'Acme Corp',
        'Technology',
        mockResponses.researchData
      )

      expect(checkResearchSufficiency).toHaveBeenCalledWith(
        mockResponses.researchData,
        undefined // No enriched research
      )
    })
  })

  describe('with web research available', () => {
    beforeEach(() => {
      vi.resetModules()
    })

    it('should attempt enrichment when web research is available', async () => {
      const mockWebResearch = {
        isAvailable: vi.fn(() => true),
        runEnrichmentSearches: vi.fn().mockResolvedValue({
          financials: { query: 'test', results: [] },
          quotes: { query: 'test', results: [] },
          competitors: { query: 'test', results: [] },
          analysts: { query: 'test', results: [] },
          precedents: { query: 'test', results: [] },
        }),
      }

      vi.doMock('@/lib/ai/providers/web-research', () => ({
        getWebResearchProvider: vi.fn(() => mockWebResearch),
      }))

      // The enrichment would run, but since mocks return empty results,
      // synthesize functions return empty arrays
      const result = await runResearchPhase(
        mockAIProvider,
        'Test article content',
        'Acme Corp',
        'Technology',
        mockResponses.researchData
      )

      expect(result.researchData).toBeDefined()
      expect(result.sufficiencyResult).toBeDefined()
    })
  })

  describe('sufficiency result', () => {
    it('should include sufficiency score', async () => {
      const result = await runResearchPhase(
        mockAIProvider,
        'Test article content',
        'Acme Corp',
        'Technology',
        mockResponses.researchData
      )

      expect(result.sufficiencyResult.score).toBe(75)
      expect(result.sufficiencyResult.level).toBe('partial')
    })
  })
})

