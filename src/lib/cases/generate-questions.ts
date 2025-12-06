import type { AIProvider, CaseContent, Question } from './types'
import type { QuestionPhaseResult } from './types'

/**
 * Default concepts to use if none are specified
 */
const DEFAULT_CONCEPTS = ['Strategy', 'Finance', 'Marketing']

/**
 * Run the question generation phase
 */
export async function runQuestionGenerationPhase(
  provider: AIProvider,
  caseContent: CaseContent,
  targetConcepts?: string[]
): Promise<QuestionPhaseResult> {
  const concepts =
    targetConcepts && targetConcepts.length > 0
      ? targetConcepts
      : DEFAULT_CONCEPTS

  const questions = await provider.generateQuestions(caseContent, concepts)

  return {
    questions,
  }
}

