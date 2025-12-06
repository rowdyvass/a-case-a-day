import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { getAIProvider } from '@/lib/ai'
import {
  generateCaseSchema,
  validateRequestBody,
  formatZodErrors,
} from '@/lib/validations/schemas'
import {
  analyzeAndDetectMetadata,
  researchCompany,
  runResearchPhase,
  runContentGenerationPhase,
  runExhibitGenerationPhase,
  runQuestionGenerationPhase,
  runValidationAndGradingPhase,
  runIllustrationGenerationPhase,
  persistCase,
  type GenerationResult,
} from '@/lib/cases'

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate input
    const validation = await validateRequestBody(request, generateCaseSchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: formatZodErrors(validation.error) },
        { status: 400 }
      )
    }

    const input = validation.data
    const provider = getAIProvider()
    const userId = (session.user as { id: string }).id

    // Phase 1: Analyze and detect metadata
    const { companyName, industry, targetConcepts, analysis } =
      await analyzeAndDetectMetadata(provider, input)

    // Phase 2: Research company and run enrichment
    const baseResearchData = await researchCompany(provider, companyName, industry)
    const { researchData, enrichedResearch, sufficiencyResult } =
      await runResearchPhase(
        provider,
        input.sourceArticle,
        companyName,
        industry,
        baseResearchData
      )

    // Phase 3: Generate protagonist and case content
    const { protagonist, caseContent } = await runContentGenerationPhase(
      provider,
      input.sourceArticle,
      companyName,
      industry,
      researchData,
      enrichedResearch,
      targetConcepts,
      input.learningObjectives,
      input.additionalGuidance
    )

    // Phase 4: Generate exhibits
    const { exhibits } = await runExhibitGenerationPhase(provider, caseContent)

    // Phase 5: Generate questions
    const { questions } = await runQuestionGenerationPhase(
      provider,
      caseContent,
      targetConcepts
    )

    // Phase 6: Validate and grade (with improvement loop)
    const {
      validationResult,
      gradeResult,
      finalCaseContent,
      finalExhibits,
      finalQuestions,
      improvementIterations,
      requiresReview,
    } = await runValidationAndGradingPhase(
      provider,
      caseContent,
      exhibits,
      questions,
      input.sourceArticle,
      enrichedResearch
    )

    // Phase 7: Generate illustration
    const { imagePath: featuredImage, illustrationPrompt } = 
      await runIllustrationGenerationPhase(finalCaseContent)

    // Phase 8: Persist to database
    const { caseId, slug, title } = await persistCase({
      userId,
      caseContent: finalCaseContent,
      exhibits: finalExhibits,
      questions: finalQuestions,
      protagonist,
      companyName,
      industry,
      targetConcepts,
      sourceArticle: input.sourceArticle,
      articleTitle: input.articleTitle,
      sourceUrl: input.sourceUrl || undefined,
      enrichedResearch,
      sufficiencyResult,
      validationResult,
      gradeResult,
      improvementIterations,
      requiresReview,
      featuredImage,
      illustrationPrompt,
    })

    // Build response
    const response: GenerationResult = {
      id: caseId,
      slug,
      title,
      company: companyName,
      industry,
      concepts: targetConcepts,
      protagonist: protagonist
        ? { name: protagonist.name, role: protagonist.role }
        : undefined,
      sufficiency: {
        score: sufficiencyResult.score,
        level: sufficiencyResult.level,
        isAcceptable: sufficiencyResult.isAcceptable,
      },
      enrichment: enrichedResearch
        ? {
            sourcesCount: enrichedResearch.sources.length,
            realQuotesCount: enrichedResearch.realQuotes.length,
            financialDataPoints: enrichedResearch.financials.length,
            hasOutcomeData: !!enrichedResearch.outcome,
          }
        : undefined,
      validation: validationResult
        ? {
            score: validationResult.score,
            confidence: validationResult.overallConfidence,
            requiresReview,
          }
        : undefined,
      grading: gradeResult
        ? {
            grade: gradeResult.grade,
            score: gradeResult.score,
            isPublishReady: gradeResult.isPublishReady,
            improvementIterations,
          }
        : undefined,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Case generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate case' },
      { status: 500 }
    )
  }
}
