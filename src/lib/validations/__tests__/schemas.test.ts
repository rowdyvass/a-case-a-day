import { describe, it, expect } from 'vitest'
import {
  generateCaseSchema,
  analyzeCaseSchema,
  submitResponseSchema,
  validateRequestBody,
  formatZodErrors,
} from '../schemas'

describe('generateCaseSchema', () => {
  it('should accept valid input with only sourceArticle', () => {
    const input = {
      sourceArticle: 'A'.repeat(100), // Minimum 100 chars
    }

    const result = generateCaseSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should accept valid input with all fields', () => {
    const input = {
      sourceArticle: 'A'.repeat(200),
      articleTitle: 'Test Article',
      sourceUrl: 'https://example.com/article',
      companyName: 'Acme Corp',
      industry: 'Technology',
      learningObjectives: 'Learn strategic analysis',
      additionalGuidance: 'Focus on competition',
      targetConcepts: ["Porter's Five Forces", 'SWOT Analysis'],
    }

    const result = generateCaseSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should reject empty sourceArticle', () => {
    const input = {
      sourceArticle: '',
    }

    const result = generateCaseSchema.safeParse(input)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 100 characters')
    }
  })

  it('should reject sourceArticle that is too short', () => {
    const input = {
      sourceArticle: 'Too short',
    }

    const result = generateCaseSchema.safeParse(input)
    expect(result.success).toBe(false)
    if (!result.success) {
      // Zod v4 uses 'issues', v3 uses 'errors'
      const issues = result.error.issues || (result.error as unknown as { errors: unknown[] }).errors
      expect(issues.length).toBeGreaterThan(0)
    }
  })

  it('should reject invalid sourceUrl', () => {
    const input = {
      sourceArticle: 'A'.repeat(100),
      sourceUrl: 'not-a-valid-url',
    }

    const result = generateCaseSchema.safeParse(input)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Invalid URL')
    }
  })

  it('should accept empty string for sourceUrl', () => {
    const input = {
      sourceArticle: 'A'.repeat(100),
      sourceUrl: '',
    }

    const result = generateCaseSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should accept missing optional fields', () => {
    const input = {
      sourceArticle: 'A'.repeat(100),
    }

    const result = generateCaseSchema.safeParse(input)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.companyName).toBeUndefined()
      expect(result.data.industry).toBeUndefined()
      expect(result.data.targetConcepts).toBeUndefined()
    }
  })
})

describe('analyzeCaseSchema', () => {
  it('should accept valid input', () => {
    const input = {
      content: 'A'.repeat(100),
      title: 'Test Title',
    }

    const result = analyzeCaseSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should accept input without title', () => {
    const input = {
      content: 'A'.repeat(100),
    }

    const result = analyzeCaseSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should reject content that is too short', () => {
    const input = {
      content: 'Short',
    }

    const result = analyzeCaseSchema.safeParse(input)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 100 characters')
    }
  })

  it('should reject missing content', () => {
    const input = {
      title: 'Test Title',
    }

    const result = analyzeCaseSchema.safeParse(input)
    expect(result.success).toBe(false)
  })
})

describe('submitResponseSchema', () => {
  it('should accept number response (multiple choice)', () => {
    const input = { response: 2 }
    const result = submitResponseSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should accept string response (free text)', () => {
    const input = { response: 'This is my analysis of the case...' }
    const result = submitResponseSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should accept array of numbers (ranking)', () => {
    const input = { response: [2, 0, 3, 1] }
    const result = submitResponseSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('should accept object response (structured framework)', () => {
    const input = {
      response: {
        forces: {
          competitiveRivalry: 'High',
          supplierPower: 'Medium',
        },
      },
    }
    const result = submitResponseSchema.safeParse(input)
    // Object responses should be accepted via z.record
    // If the union fails, it might accept via string coercion
    expect(result.success).toBe(true)
  })

  it('should reject missing response', () => {
    const input = {}
    const result = submitResponseSchema.safeParse(input)
    expect(result.success).toBe(false)
  })

  it('should reject null response', () => {
    const input = { response: null }
    const result = submitResponseSchema.safeParse(input)
    expect(result.success).toBe(false)
  })
})

describe('validateRequestBody', () => {
  it('should return success with valid data', async () => {
    const mockRequest = {
      json: async () => ({ content: 'A'.repeat(100) }),
    } as Request

    const result = await validateRequestBody(mockRequest, analyzeCaseSchema)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.content).toBe('A'.repeat(100))
    }
  })

  it('should return error with invalid data', async () => {
    const mockRequest = {
      json: async () => ({ content: 'Short' }),
    } as Request

    const result = await validateRequestBody(mockRequest, analyzeCaseSchema)
    expect(result.success).toBe(false)
  })

  it('should handle JSON parse errors', async () => {
    const mockRequest = {
      json: async () => {
        throw new Error('Invalid JSON')
      },
    } as Request

    const result = await validateRequestBody(mockRequest, analyzeCaseSchema)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Invalid JSON body')
    }
  })
})

describe('formatZodErrors', () => {
  it('should format single error', () => {
    const result = generateCaseSchema.safeParse({ sourceArticle: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const formatted = formatZodErrors(result.error)
      expect(typeof formatted).toBe('string')
      expect(formatted.length).toBeGreaterThan(0)
      // The error message should mention the field or constraint
      expect(formatted.toLowerCase()).toMatch(/source|article|100|character/i)
    }
  })

  it('should format multiple errors', () => {
    const result = generateCaseSchema.safeParse({
      sourceArticle: '',
      sourceUrl: 'invalid',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const formatted = formatZodErrors(result.error)
      expect(typeof formatted).toBe('string')
      // Multiple errors should be joined
      expect(formatted.length).toBeGreaterThan(0)
    }
  })
})

