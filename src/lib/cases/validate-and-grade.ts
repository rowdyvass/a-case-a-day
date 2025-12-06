import type {
  AIProvider,
  CaseContent,
  Exhibit,
  Question,
  EnrichedResearch,
  ValidationResult,
  CaseGradeResult,
} from './types'
import {
  getValidationSummary,
  requiresHumanReview,
} from '@/lib/ai/prompts/validation'
import {
  getGradeSummary,
  shouldImprove,
  MAX_IMPROVEMENT_ITERATIONS,
} from '@/lib/ai/prompts/case-grading'
import type { ValidationPhaseResult } from './types'

/**
 * Run the validation and grading phase with iterative improvement
 */
export async function runValidationAndGradingPhase(
  provider: AIProvider,
  caseContent: CaseContent,
  exhibits: Exhibit[],
  questions: Question[],
  sourceArticle: string,
  enrichedResearch: EnrichedResearch | undefined
): Promise<ValidationPhaseResult> {
  // Validate the case against sources
  const validationResult = await validateCase(
    provider,
    caseContent,
    sourceArticle,
    enrichedResearch
  )

  // Grade and potentially improve the case
  const gradingResult = await gradeAndImproveCase(
    provider,
    caseContent,
    exhibits,
    questions
  )

  // Determine if human review is required
  const needsReview =
    (validationResult ? requiresHumanReview(validationResult) : false) ||
    (gradingResult.gradeResult ? !gradingResult.gradeResult.isPublishReady : false)

  return {
    validationResult,
    gradeResult: gradingResult.gradeResult,
    finalCaseContent: gradingResult.finalCaseContent,
    finalExhibits: exhibits, // Exhibits not modified in grading
    finalQuestions: questions, // Questions not modified in grading
    improvementIterations: gradingResult.improvementIterations,
    requiresReview: needsReview,
  }
}

/**
 * Validate the case against source material
 */
async function validateCase(
  provider: AIProvider,
  caseContent: CaseContent,
  sourceArticle: string,
  enrichedResearch: EnrichedResearch | undefined
): Promise<ValidationResult | null> {
  try {
    const result = await provider.validateCase(
      caseContent,
      sourceArticle,
      enrichedResearch
    )

    if (process.env.NODE_ENV === 'development') {
      console.log(getValidationSummary(result))
      if (requiresHumanReview(result)) {
        console.log('Case flagged for human review')
      }
    }

    return result
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Validation failed, proceeding without:', error)
    }
    return null
  }
}

interface GradingPhaseResult {
  gradeResult: CaseGradeResult | null
  finalCaseContent: CaseContent
  improvementIterations: number
}

/**
 * Grade the case and run iterative improvement loop
 */
async function gradeAndImproveCase(
  provider: AIProvider,
  caseContent: CaseContent,
  exhibits: Exhibit[],
  questions: Question[]
): Promise<GradingPhaseResult> {
  let finalCaseContent: CaseContent = caseContent
  let gradeResult: CaseGradeResult | null = null
  let improvementIterations = 0

  try {
    gradeResult = await provider.gradeCase(caseContent, exhibits, questions)

    if (process.env.NODE_ENV === 'development') {
      console.log(getGradeSummary(gradeResult))
    }

    // Iterative improvement loop - improve until A- or max iterations
    while (shouldImprove(gradeResult, improvementIterations)) {
      improvementIterations++

      if (process.env.NODE_ENV === 'development') {
        console.log(
          `Improvement iteration ${improvementIterations}/${MAX_IMPROVEMENT_ITERATIONS}`
        )
        console.log(`  Current grade: ${gradeResult.grade} (${gradeResult.score}/100)`)
        console.log(`  Weakest category: ${gradeResult.weakestCategory}`)
      }

      try {
        // Improve the weakest category
        const improvedContent = await provider.improveCase(
          finalCaseContent,
          gradeResult,
          gradeResult.weakestCategory
        )
        finalCaseContent = improvedContent

        // Re-grade the improved case
        const newGrade = await provider.gradeCase(
          finalCaseContent,
          exhibits,
          questions
        )

        // Only accept improvement if grade actually improved
        if (newGrade.score > gradeResult.score) {
          const improvement = newGrade.score - gradeResult.score
          gradeResult = newGrade
          if (process.env.NODE_ENV === 'development') {
            console.log(`  Improvement accepted (+${improvement} points)`)
          }
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('  Improvement did not improve score, reverting')
          }
          break
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`  Improvement iteration ${improvementIterations} failed:`, error)
        }
        break
      }
    }

    // Final grade summary
    if (process.env.NODE_ENV === 'development' && gradeResult) {
      console.log(`Final case grade: ${gradeResult.grade} (${gradeResult.score}/100)`)
      console.log(
        `  Publish ready: ${gradeResult.isPublishReady ? 'Yes' : 'No - requires review'}`
      )
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Case grading failed, proceeding without:', error)
    }
    gradeResult = null
  }

  return {
    gradeResult,
    finalCaseContent,
    improvementIterations,
  }
}

