import { z } from 'zod'

/**
 * Schema for case generation API endpoint
 * POST /api/cases/generate
 */
export const generateCaseSchema = z.object({
  // Required field - the source article content
  sourceArticle: z
    .string()
    .min(100, 'Source article must be at least 100 characters'),

  // Optional metadata fields
  articleTitle: z.string().optional(),
  sourceUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),

  // Optional auto-detected fields (if not provided, AI will detect)
  companyName: z.string().optional(),
  industry: z.string().optional(),

  // Optional guidance fields
  learningObjectives: z.string().optional(),
  additionalGuidance: z.string().optional(),
  targetConcepts: z.array(z.string()).optional(),
})

export type GenerateCaseInput = z.infer<typeof generateCaseSchema>

/**
 * Schema for content analysis API endpoint
 * POST /api/cases/analyze
 */
export const analyzeCaseSchema = z.object({
  content: z
    .string()
    .min(100, 'Content must be at least 100 characters'),
  title: z.string().optional(),
})

export type AnalyzeCaseInput = z.infer<typeof analyzeCaseSchema>

/**
 * Schema for question response submission
 * POST /api/questions/[id]/submit
 * 
 * Response types vary by question type:
 * - multiple_choice: number (selected index)
 * - free_text: string
 * - ranking: number[] (ordered indices)
 * - framework_application: string or object
 */
export const submitResponseSchema = z.object({
  response: z.union([
    z.number(), // multiple_choice
    z.string(), // free_text, framework_application
    z.array(z.number()), // ranking
    z.record(z.string(), z.unknown()), // structured framework response
  ]),
})

export type SubmitResponseInput = z.infer<typeof submitResponseSchema>

/**
 * Helper to parse and validate request body with a Zod schema
 * Returns either the validated data or an error response
 */
export async function validateRequestBody<T extends z.ZodSchema>(
  request: Request,
  schema: T
): Promise<
  | { success: true; data: z.infer<T> }
  | { success: false; error: z.ZodError }
> {
  try {
    const body = await request.json()
    const result = schema.safeParse(body)
    
    if (result.success) {
      return { success: true, data: result.data }
    }
    
    return { success: false, error: result.error }
  } catch {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: 'custom',
          message: 'Invalid JSON body',
          path: [],
        },
      ]),
    }
  }
}

/**
 * Format Zod errors into a user-friendly message
 * Compatible with both Zod v3 (errors) and Zod v4 (issues)
 */
export function formatZodErrors(error: z.ZodError): string {
  // Zod v4 uses 'issues', v3 uses 'errors'
  const issues = error.issues || (error as unknown as { errors: z.ZodIssue[] }).errors || []
  return issues
    .map((e) => {
      const path = e.path.length > 0 ? `${e.path.join('.')}: ` : ''
      return `${path}${e.message}`
    })
    .join('; ')
}

