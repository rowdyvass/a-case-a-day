import { prisma } from '@/lib/db'
import { slugify } from '@/lib/utils'
import {
  getAllActivePrompts,
  createPromptVersionsJson,
} from '@/lib/prompts/registry'
import { requiresHumanReview } from '@/lib/ai/prompts/validation'
import { saveProtagonistNames } from '@/lib/protagonists'
import type {
  CaseContent,
  Exhibit,
  Question,
  ProtagonistProfile,
  EnrichedResearch,
  ValidationResult,
  SufficiencyResult,
  CaseGradeResult,
} from './types'
import type { PersistenceResult } from './types'

interface PersistCaseParams {
  // User context
  userId: string

  // Core case data
  caseContent: CaseContent
  exhibits: Exhibit[]
  questions: Question[]
  protagonist?: ProtagonistProfile

  // Metadata
  companyName: string
  industry: string
  targetConcepts: string[]

  // Source article
  sourceArticle: string
  articleTitle?: string
  sourceUrl?: string

  // Research data
  enrichedResearch?: EnrichedResearch
  sufficiencyResult: SufficiencyResult

  // Validation and grading
  validationResult: ValidationResult | null
  gradeResult: CaseGradeResult | null
  improvementIterations: number
  requiresReview: boolean

  // Case categorization
  category?: string
  publishedDate?: Date | null
  track?: string | null
  skill?: string | null
  difficulty?: string

  // Illustration data
  featuredImage?: string | null
  illustrationPrompt?: string | null
}

/**
 * Persist the generated case to the database
 */
export async function persistCase(params: PersistCaseParams): Promise<PersistenceResult> {
  const {
    userId,
    caseContent,
    exhibits,
    questions,
    protagonist,
    companyName,
    industry,
    targetConcepts,
    sourceArticle,
    articleTitle,
    sourceUrl,
    enrichedResearch,
    sufficiencyResult,
    validationResult,
    gradeResult,
    improvementIterations,
    requiresReview,
    // Category metadata
    category = 'daily',
    publishedDate,
    track,
    skill,
    difficulty = 'intermediate',
    // Illustration data
    featuredImage,
    illustrationPrompt,
  } = params

  // Get prompt versions for tracking
  const promptVersionsJson = await getPromptVersionsJson()

  // Create unique slug
  const slug = await createUniqueSlug(caseContent.title)

  // Prepare content JSON with all metadata
  const contentData = buildContentData(
    caseContent,
    protagonist,
    enrichedResearch,
    validationResult,
    gradeResult,
    improvementIterations,
    illustrationPrompt
  )

  // Save to database
  const savedCase = await prisma.case.create({
    data: {
      slug,
      title: caseContent.title,
      company: caseContent.company || companyName,
      industry: caseContent.industry || industry,
      summary: caseContent.summary,
      content: JSON.stringify(contentData),
      status: 'draft',
      authorId: userId,

      // Illustration
      featuredImage: featuredImage ?? null,
      illustrationPrompt: illustrationPrompt ?? null,

      // Case categorization
      category,
      publishedDate: publishedDate ?? null,
      track: track ?? null,
      skill: skill ?? null,
      difficulty,

      // Enrichment data
      enrichmentData: enrichedResearch
        ? JSON.stringify(buildEnrichmentMetadata(enrichedResearch))
        : null,
      enrichmentSources: enrichedResearch
        ? JSON.stringify(enrichedResearch.sources)
        : null,

      // Sufficiency data
      sufficiencyScore: sufficiencyResult.score,
      sufficiencyLevel: sufficiencyResult.level,
      sufficiencyData: JSON.stringify(sufficiencyResult),

      // Validation data
      validationScore: validationResult?.score ?? null,
      validationConfidence: validationResult?.overallConfidence ?? null,
      validationData: validationResult ? JSON.stringify(validationResult) : null,
      requiresReview,

      // Case quality grading data
      caseGrade: gradeResult?.grade ?? null,
      caseGradeScore: gradeResult?.score ?? null,
      caseGradeData: gradeResult ? JSON.stringify(gradeResult) : null,
      improvementIterations,

      // Prompt version tracking
      promptVersions: promptVersionsJson,

      // Related records
      sourceArticles: {
        create: {
          type: sourceUrl ? 'url' : 'text',
          title: articleTitle,
          content: sourceArticle,
          url: sourceUrl,
        },
      },
      exhibits: {
        create: exhibits
          // Filter out exhibits with missing or empty data
          .filter((exhibit) => {
            if (!exhibit.data) return false
            if (typeof exhibit.data === 'object' && Object.keys(exhibit.data).length === 0) return false
            if (typeof exhibit.data === 'string' && exhibit.data.trim() === '') return false
            return true
          })
          .map((exhibit, index) => ({
            type: exhibit.type,
            title: exhibit.title,
            data: JSON.stringify(exhibit.data),
            order: index,
          })),
      },
      questions: {
        create: questions.map((question, index) => ({
          text: question.text,
          difficulty: question.difficulty,
          order: index,
        })),
      },
    },
  })

  // Link concepts
  await linkConcepts(savedCase.id, targetConcepts)

  // Save protagonist and supporting character names for collision prevention
  const effectiveProtagonist = caseContent.protagonist || protagonist
  if (effectiveProtagonist) {
    const nameDate = publishedDate || savedCase.createdAt
    await saveProtagonistNames(savedCase.id, effectiveProtagonist, nameDate)
  }

  return {
    caseId: savedCase.id,
    slug: savedCase.slug,
    title: savedCase.title,
  }
}

/**
 * Create a unique slug for the case
 */
async function createUniqueSlug(title: string): Promise<string> {
  const baseSlug = slugify(title)
  let slug = baseSlug
  let counter = 1

  while (await prisma.case.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

/**
 * Get prompt versions JSON for tracking
 */
async function getPromptVersionsJson(): Promise<string | null> {
  try {
    const activePrompts = await getAllActivePrompts()
    return createPromptVersionsJson(activePrompts)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to get prompt versions:', error)
    }
    return null
  }
}

/**
 * Build the content JSON object
 */
function buildContentData(
  caseContent: CaseContent,
  protagonist: ProtagonistProfile | undefined,
  enrichedResearch: EnrichedResearch | undefined,
  validationResult: ValidationResult | null,
  gradeResult: CaseGradeResult | null,
  improvementIterations: number,
  illustrationPrompt?: string | null
) {
  return {
    sections: caseContent.sections,
    protagonist: caseContent.protagonist || protagonist,
    // Store illustration prompt for variety tracking
    illustrationPrompt: illustrationPrompt ?? undefined,
    // Include enrichment metadata if available
    enrichment: enrichedResearch
      ? {
          sources: enrichedResearch.sources,
          enrichmentTimestamp: enrichedResearch.enrichmentTimestamp,
          realQuotesCount: enrichedResearch.realQuotes.length,
          financialDataPoints: enrichedResearch.financials.length,
          hasOutcomeData: !!enrichedResearch.outcome,
        }
      : undefined,
    // Include validation metadata if available
    validation: validationResult
      ? {
          score: validationResult.score,
          confidence: validationResult.overallConfidence,
          requiresReview: requiresHumanReview(validationResult),
          issueCount: validationResult.factualIssues.length,
        }
      : undefined,
    // Include grading metadata if available
    grading: gradeResult
      ? {
          grade: gradeResult.grade,
          score: gradeResult.score,
          isPublishReady: gradeResult.isPublishReady,
          improvementIterations,
          breakdown: gradeResult.breakdown,
        }
      : undefined,
  }
}

/**
 * Build enrichment metadata for storage
 */
function buildEnrichmentMetadata(enrichedResearch: EnrichedResearch) {
  return {
    timestamp: enrichedResearch.enrichmentTimestamp,
    realQuotesCount: enrichedResearch.realQuotes.length,
    financialDataPoints: enrichedResearch.financials.length,
    competitorInsights: enrichedResearch.competitorMoves.length,
    analystComments: enrichedResearch.analystPerspectives.length,
    historicalPrecedents: enrichedResearch.historicalPrecedents.length,
    hasOutcomeData: !!enrichedResearch.outcome,
    searchQueries: enrichedResearch.searchQueries,
  }
}

/**
 * Link concepts to the case
 */
async function linkConcepts(caseId: string, targetConcepts: string[]): Promise<void> {
  if (!targetConcepts || targetConcepts.length === 0) {
    return
  }

  const conceptRecords = await prisma.concept.findMany({
    where: { name: { in: targetConcepts } },
  })

  if (conceptRecords.length > 0) {
    await prisma.caseConcept.createMany({
      data: conceptRecords.map((concept) => ({
        caseId,
        conceptId: concept.id,
      })),
    })
  }
}

