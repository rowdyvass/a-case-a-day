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

import { persistCase } from '../persist'
import { prisma } from '@/lib/db'
import { mockResponses } from '@/__mocks__/ai-provider'

// Cast for mock access
const mockPrisma = prisma as unknown as {
  concept: { findMany: ReturnType<typeof vi.fn> }
  case: { findUnique: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> }
  caseConcept: { createMany: ReturnType<typeof vi.fn> }
}

// Mock utility functions
vi.mock('@/lib/utils', () => ({
  slugify: vi.fn((text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
  ),
}))

// Mock prompt registry
vi.mock('@/lib/prompts/registry', () => ({
  getAllActivePrompts: vi.fn().mockResolvedValue([]),
  createPromptVersionsJson: vi.fn().mockReturnValue('{}'),
}))

// Mock validation helpers
vi.mock('@/lib/ai/prompts/validation', () => ({
  requiresHumanReview: vi.fn(() => false),
}))

describe('persistCase', () => {
  const defaultParams = {
    userId: 'user-123',
    caseContent: mockResponses.caseContent,
    exhibits: mockResponses.exhibits,
    questions: mockResponses.questions,
    protagonist: mockResponses.protagonist,
    companyName: 'Acme Corp',
    industry: 'Technology',
    targetConcepts: ['SWOT Analysis', "Porter's Five Forces"],
    sourceArticle: 'Test source article content',
    articleTitle: 'Test Article',
    sourceUrl: 'https://example.com/article',
    enrichedResearch: undefined,
    sufficiencyResult: {
      score: 75,
      level: 'partial' as const,
      isAcceptable: true,
      adjustments: [],
      details: {},
    },
    validationResult: mockResponses.validationResult,
    gradeResult: mockResponses.gradeResult,
    improvementIterations: 0,
    requiresReview: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Set up default mock responses
    mockPrisma.case.findUnique.mockResolvedValue(null) // No existing slug
    mockPrisma.case.create.mockResolvedValue({
      id: 'case-123',
      slug: 'acme-corp-strategic-crossroads',
      title: 'Acme Corp: Strategic Crossroads',
    })
    mockPrisma.concept.findMany.mockResolvedValue([
      { id: 'concept-1', name: 'SWOT Analysis' },
      { id: 'concept-2', name: "Porter's Five Forces" },
    ])
    mockPrisma.caseConcept.createMany.mockResolvedValue({ count: 2 })
  })

  it('should create a case with correct data', async () => {
    const result = await persistCase(defaultParams)

    expect(result.caseId).toBe('case-123')
    expect(result.slug).toBe('acme-corp-strategic-crossroads')
    expect(result.title).toBe('Acme Corp: Strategic Crossroads')
  })

  it('should create unique slug when slug exists', async () => {
    // First call returns existing case, second returns null
    mockPrisma.case.findUnique
      .mockResolvedValueOnce({ id: 'existing-case' })
      .mockResolvedValueOnce(null)

    await persistCase(defaultParams)

    // Should have checked twice for slug uniqueness
    expect(mockPrisma.case.findUnique).toHaveBeenCalledTimes(2)
    expect(mockPrisma.case.findUnique).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ where: { slug: 'acme-corp-strategic-crossroads' } })
    )
    expect(mockPrisma.case.findUnique).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ where: { slug: 'acme-corp-strategic-crossroads-1' } })
    )
  })

  it('should create source article record', async () => {
    await persistCase(defaultParams)

    expect(mockPrisma.case.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          sourceArticles: {
            create: {
              type: 'url',
              title: 'Test Article',
              content: 'Test source article content',
              url: 'https://example.com/article',
            },
          },
        }),
      })
    )
  })

  it('should create source article as text when no URL', async () => {
    const params = { ...defaultParams, sourceUrl: undefined }
    await persistCase(params)

    expect(mockPrisma.case.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          sourceArticles: {
            create: expect.objectContaining({
              type: 'text',
            }),
          },
        }),
      })
    )
  })

  it('should create exhibit records', async () => {
    await persistCase(defaultParams)

    expect(mockPrisma.case.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          exhibits: {
            create: expect.arrayContaining([
              expect.objectContaining({
                type: 'chart',
                title: 'Revenue Growth',
                order: 0,
              }),
              expect.objectContaining({
                type: 'table',
                title: 'Competitive Analysis',
                order: 1,
              }),
            ]),
          },
        }),
      })
    )
  })

  it('should create question records', async () => {
    await persistCase(defaultParams)

    expect(mockPrisma.case.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          questions: {
            create: expect.arrayContaining([
              expect.objectContaining({
                text: expect.any(String),
                difficulty: expect.any(String),
                order: expect.any(Number),
              }),
            ]),
          },
        }),
      })
    )
  })

  it('should link concepts to case', async () => {
    await persistCase(defaultParams)

    expect(mockPrisma.concept.findMany).toHaveBeenCalledWith({
      where: { name: { in: ['SWOT Analysis', "Porter's Five Forces"] } },
    })
    expect(mockPrisma.caseConcept.createMany).toHaveBeenCalledWith({
      data: [
        { caseId: 'case-123', conceptId: 'concept-1' },
        { caseId: 'case-123', conceptId: 'concept-2' },
      ],
    })
  })

  it('should not link concepts when none provided', async () => {
    const params = { ...defaultParams, targetConcepts: [] }
    await persistCase(params)

    expect(mockPrisma.caseConcept.createMany).not.toHaveBeenCalled()
  })

  it('should store sufficiency data', async () => {
    await persistCase(defaultParams)

    expect(mockPrisma.case.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          sufficiencyScore: 75,
          sufficiencyLevel: 'partial',
          sufficiencyData: expect.any(String),
        }),
      })
    )
  })

  it('should store validation data when provided', async () => {
    await persistCase(defaultParams)

    expect(mockPrisma.case.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          validationScore: mockResponses.validationResult.score,
          validationConfidence: mockResponses.validationResult.overallConfidence,
          validationData: expect.any(String),
        }),
      })
    )
  })

  it('should store null validation data when not provided', async () => {
    const params = { ...defaultParams, validationResult: null }
    await persistCase(params)

    expect(mockPrisma.case.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          validationScore: null,
          validationConfidence: null,
          validationData: null,
        }),
      })
    )
  })

  it('should store grading data', async () => {
    await persistCase(defaultParams)

    expect(mockPrisma.case.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          caseGrade: mockResponses.gradeResult.grade,
          caseGradeScore: mockResponses.gradeResult.score,
          caseGradeData: expect.any(String),
          improvementIterations: 0,
        }),
      })
    )
  })

  it('should set status to draft', async () => {
    await persistCase(defaultParams)

    expect(mockPrisma.case.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'draft',
        }),
      })
    )
  })
})

