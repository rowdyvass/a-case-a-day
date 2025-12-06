import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { getAIProvider } from '@/lib/ai'
import type { ConceptOption } from '@/lib/ai/providers/types'
import {
  analyzeCaseSchema,
  validateRequestBody,
  formatZodErrors,
} from '@/lib/validations/schemas'

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate input with Zod
    const validation = await validateRequestBody(request, analyzeCaseSchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: formatZodErrors(validation.error) },
        { status: 400 }
      )
    }

    const { content, title } = validation.data

    // Fetch all concepts from the database
    const concepts = await prisma.concept.findMany({
      select: {
        name: true,
        category: true,
      },
    })

    const conceptOptions: ConceptOption[] = concepts.map((c) => ({
      name: c.name,
      category: c.category,
    }))

    // Get AI provider and analyze content
    const provider = getAIProvider()
    const analysis = await provider.analyzeContent(content, conceptOptions)

    // Validate that recommended concepts exist in our database
    const validConceptNames = concepts.map((c) => c.name)
    const validatedConcepts = analysis.recommendedConcepts.filter((rc) =>
      validConceptNames.includes(rc.name)
    )

    return NextResponse.json({
      company: analysis.company.name,
      secondaryCompanies: analysis.company.secondaryCompanies,
      industry: analysis.industry.primary,
      subSector: analysis.industry.subSector,
      recommendedConcepts: validatedConcepts,
      learningObjectives: analysis.learningObjectives,
      summary: analysis.summary,
      confidence: analysis.confidence,
      title: title || analysis.summary.slice(0, 100),
    })
  } catch (error) {
    console.error('Content analysis error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze content' },
      { status: 500 }
    )
  }
}
