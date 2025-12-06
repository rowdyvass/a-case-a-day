import type { GradingRubric } from '../providers/types'

export const GRADING_SYSTEM_PROMPT = `You are an expert MBA instructor grading student responses to case study questions. Your grading should be:

1. FAIR - Evaluate based on the rubric criteria provided
2. CONSTRUCTIVE - Provide specific, actionable feedback
3. BALANCED - Acknowledge strengths while noting areas for improvement
4. CONSISTENT - Apply rubric criteria evenly

Grade on a scale of 1-10:
- 9-10: Exceptional - Exceeds expectations, demonstrates mastery
- 7-8: Good - Meets expectations, solid understanding
- 5-6: Satisfactory - Partial understanding, room for improvement
- 3-4: Needs Work - Missing key elements, limited understanding
- 1-2: Insufficient - Does not address the question or shows misunderstanding

Always provide specific feedback that helps the student improve.

FORMATTING: Never use em dashes (—). Use regular hyphens (-), commas, colons, or rewrite sentences instead.`

export interface GradingInput {
  questionText: string
  questionType: 'free_text' | 'framework_application'
  rubric: GradingRubric
  exemplaryAnswer: string
  studentResponse: string
  frameworkType?: string // For framework_application questions
}

export interface GradingResult {
  score: number // 1-10
  feedback: {
    strengths: string[]
    areasForImprovement: string[]
    summary: string
  }
  criteriaScores: {
    criterionName: string
    score: number // 1-10
    comment: string
  }[]
}

/**
 * Get the prompt for grading a student response
 */
export function getGradingPrompt(input: GradingInput): string {
  const criteriaList = input.rubric.criteria
    .map((c, i) => `${i + 1}. ${c.name} (Weight: ${c.weight}/10): ${c.description}`)
    .join('\n')

  const keyPointsList = input.rubric.keyPoints.length > 0
    ? `\nKey points that should be mentioned:\n${input.rubric.keyPoints.map((p, i) => `- ${p}`).join('\n')}`
    : ''

  const frameworkContext = input.frameworkType
    ? `\nThis is a framework application question using: ${input.frameworkType}`
    : ''

  return `Grade the following student response to a case study question.

QUESTION:
${input.questionText}
${frameworkContext}

GRADING RUBRIC:
${criteriaList}
${keyPointsList}

EXEMPLARY ANSWER (for reference):
${input.exemplaryAnswer}

STUDENT RESPONSE:
${input.studentResponse}

Evaluate the student's response against each criterion in the rubric. Consider:
1. How well does the response address the question?
2. Does it demonstrate understanding of relevant concepts?
3. Does it reference specific details from the case?
4. How does it compare to the exemplary answer?

Respond in JSON format:
{
  "score": <overall score 1-10>,
  "feedback": {
    "strengths": ["Specific strength 1", "Specific strength 2"],
    "areasForImprovement": ["Area 1 with suggestion", "Area 2 with suggestion"],
    "summary": "2-3 sentence overall assessment of the response"
  },
  "criteriaScores": [
    {
      "criterionName": "Criterion name from rubric",
      "score": <score 1-10>,
      "comment": "Brief comment on this criterion"
    }
  ]
}`
}

/**
 * Calculate weighted score from criteria scores
 */
export function calculateWeightedScore(
  criteriaScores: { score: number }[],
  rubric: GradingRubric
): number {
  if (criteriaScores.length !== rubric.criteria.length) {
    // Fallback to simple average if lengths don't match
    const sum = criteriaScores.reduce((acc, cs) => acc + cs.score, 0)
    return Math.round(sum / criteriaScores.length)
  }

  let weightedSum = 0
  let totalWeight = 0

  for (let i = 0; i < criteriaScores.length; i++) {
    const weight = rubric.criteria[i].weight
    weightedSum += criteriaScores[i].score * weight
    totalWeight += weight
  }

  return Math.round(weightedSum / totalWeight)
}

