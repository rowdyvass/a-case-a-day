import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mocks must be hoisted before imports
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

import { analyzeAndDetectMetadata } from '../analyze'
import { prisma } from '@/lib/db'
import { mockAIProvider, mockResponses, resetAIProviderMocks } from '@/__mocks__/ai-provider'

// Cast for mock access
const mockPrisma = prisma as unknown as {
  concept: { findMany: ReturnType<typeof vi.fn> }
}

describe('analyzeAndDetectMetadata', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetAIProviderMocks()
  })

  describe('when all metadata is provided', () => {
    it('should return provided values without calling AI', async () => {
      const input = {
        sourceArticle: 'Test article content '.repeat(10),
        companyName: 'Provided Corp',
        industry: 'Finance',
        targetConcepts: ['SWOT Analysis'],
      }

      const result = await analyzeAndDetectMetadata(mockAIProvider, input)

      expect(result.companyName).toBe('Provided Corp')
      expect(result.industry).toBe('Finance')
      expect(result.targetConcepts).toEqual(['SWOT Analysis'])
      expect(result.analysis).toBeUndefined()
      expect(mockAIProvider.analyzeContent).not.toHaveBeenCalled()
    })
  })

  describe('when company is missing', () => {
    it('should auto-detect company from AI', async () => {
      const input = {
        sourceArticle: 'Test article content '.repeat(10),
        industry: 'Technology',
        targetConcepts: ['SWOT Analysis'],
      }

      mockPrisma.concept.findMany.mockResolvedValue([
        { name: 'SWOT Analysis', category: 'Strategy' },
        { name: "Porter's Five Forces", category: 'Strategy' },
      ])

      const result = await analyzeAndDetectMetadata(mockAIProvider, input)

      expect(result.companyName).toBe(mockResponses.contentAnalysis.company.name)
      expect(result.industry).toBe('Technology') // Provided, not overwritten
      expect(mockAIProvider.analyzeContent).toHaveBeenCalledOnce()
      expect(result.analysis).toBeDefined()
    })
  })

  describe('when industry is missing', () => {
    it('should auto-detect industry from AI', async () => {
      const input = {
        sourceArticle: 'Test article content '.repeat(10),
        companyName: 'Test Corp',
        targetConcepts: ['SWOT Analysis'],
      }

      mockPrisma.concept.findMany.mockResolvedValue([
        { name: 'SWOT Analysis', category: 'Strategy' },
      ])

      const result = await analyzeAndDetectMetadata(mockAIProvider, input)

      expect(result.companyName).toBe('Test Corp') // Provided
      expect(result.industry).toBe(mockResponses.contentAnalysis.industry.primary)
      expect(mockAIProvider.analyzeContent).toHaveBeenCalledOnce()
    })
  })

  describe('when concepts are missing', () => {
    it('should auto-detect concepts from AI', async () => {
      const input = {
        sourceArticle: 'Test article content '.repeat(10),
        companyName: 'Test Corp',
        industry: 'Technology',
      }

      mockPrisma.concept.findMany.mockResolvedValue([
        { name: "Porter's Five Forces", category: 'Strategy' },
        { name: 'SWOT Analysis', category: 'Strategy' },
      ])

      const result = await analyzeAndDetectMetadata(mockAIProvider, input)

      expect(result.targetConcepts).toEqual(
        mockResponses.contentAnalysis.recommendedConcepts.map((c) => c.name)
      )
      expect(mockAIProvider.analyzeContent).toHaveBeenCalledOnce()
    })

    it('should auto-detect when concepts is empty array', async () => {
      const input = {
        sourceArticle: 'Test article content '.repeat(10),
        companyName: 'Test Corp',
        industry: 'Technology',
        targetConcepts: [],
      }

      mockPrisma.concept.findMany.mockResolvedValue([
        { name: "Porter's Five Forces", category: 'Strategy' },
      ])

      const result = await analyzeAndDetectMetadata(mockAIProvider, input)

      expect(mockAIProvider.analyzeContent).toHaveBeenCalledOnce()
      expect(result.targetConcepts.length).toBeGreaterThan(0)
    })
  })

  describe('when everything is missing', () => {
    it('should auto-detect all metadata', async () => {
      const input = {
        sourceArticle: 'Test article content '.repeat(10),
      }

      mockPrisma.concept.findMany.mockResolvedValue([
        { name: "Porter's Five Forces", category: 'Strategy' },
        { name: 'SWOT Analysis', category: 'Strategy' },
        { name: 'BCG Matrix', category: 'Strategy' },
      ])

      const result = await analyzeAndDetectMetadata(mockAIProvider, input)

      expect(result.companyName).toBe(mockResponses.contentAnalysis.company.name)
      expect(result.industry).toBe(mockResponses.contentAnalysis.industry.primary)
      expect(result.targetConcepts).toEqual(
        mockResponses.contentAnalysis.recommendedConcepts.map((c) => c.name)
      )
      expect(result.analysis).toBeDefined()
    })

    it('should pass available concepts to AI provider', async () => {
      const input = {
        sourceArticle: 'Test article content '.repeat(10),
      }

      const dbConcepts = [
        { name: 'Concept A', category: 'Strategy' },
        { name: 'Concept B', category: 'Finance' },
      ]
      mockPrisma.concept.findMany.mockResolvedValue(dbConcepts)

      await analyzeAndDetectMetadata(mockAIProvider, input)

      expect(mockAIProvider.analyzeContent).toHaveBeenCalledWith(
        input.sourceArticle,
        dbConcepts.map((c) => ({ name: c.name, category: c.category }))
      )
    })
  })
})

