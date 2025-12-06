import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { getAIProvider } from '@/lib/ai'
import type { GradingRubric, QuestionType } from '@/lib/ai/providers/types'
import {
  submitResponseSchema,
  validateRequestBody,
  formatZodErrors,
} from '@/lib/validations/schemas'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * Submit a response to a question
 * POST /api/questions/[id]/submit
 *
 * Body: { response: any }
 * - For multiple_choice: response is the selected option index (number)
 * - For free_text: response is the text answer (string)
 * - For ranking: response is an array of option indices in user's order (number[])
 * - For framework_application: response is the text or structured answer (string | object)
 */
export async function POST(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Please log in to submit answers', requiresAuth: true },
      { status: 401 }
    )
  }

  const { id: questionId } = await params
  const userId = (session.user as { id: string }).id

  try {
    // Validate input with Zod
    const validation = await validateRequestBody(request, submitResponseSchema)
    if (!validation.success) {
      return NextResponse.json(
        { error: formatZodErrors(validation.error) },
        { status: 400 }
      )
    }

    const { response } = validation.data

    // Get the question with its details
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    })

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Grade the response based on question type
    const gradeResult = await gradeResponse(question, response)

    // Save or update the response
    const questionResponse = await prisma.questionResponse.upsert({
      where: {
        questionId_userId: {
          questionId,
          userId,
        },
      },
      create: {
        questionId,
        userId,
        response: JSON.stringify(response),
        score: gradeResult.score,
        feedback: gradeResult.feedback,
        gradedAt: new Date(),
      },
      update: {
        response: JSON.stringify(response),
        score: gradeResult.score,
        feedback: gradeResult.feedback,
        gradedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      score: gradeResult.score,
      feedback: gradeResult.feedback,
      isCorrect: gradeResult.isCorrect,
      exemplaryAnswer: question.exemplaryAnswer,
      responseId: questionResponse.id,
    })
  } catch (error) {
    console.error('Submit response error:', error)
    return NextResponse.json(
      { error: 'Failed to submit response' },
      { status: 500 }
    )
  }
}

interface GradeResult {
  score: number
  feedback: string
  isCorrect?: boolean
}

/**
 * Grade a response based on question type
 */
async function gradeResponse(
  question: {
    type: string
    options: string | null
    correctAnswer: string | null
    exemplaryAnswer: string | null
    rubric: string | null
    text: string
    frameworkType: string | null
  },
  response: unknown
): Promise<GradeResult> {
  const questionType = question.type as QuestionType

  switch (questionType) {
    case 'multiple_choice':
      return gradeMultipleChoice(question, response as number)

    case 'ranking':
      return gradeRanking(question, response as number[])

    case 'free_text':
    case 'framework_application':
      return gradeWithAI(question, response as string)

    default:
      // For legacy questions or unknown types, treat as free text
      return gradeWithAI(question, String(response))
  }
}

/**
 * Grade a multiple choice question (auto-graded)
 */
function gradeMultipleChoice(
  question: { correctAnswer: string | null; options: string | null },
  selectedIndex: number
): GradeResult {
  if (question.correctAnswer === null) {
    return {
      score: 0,
      feedback: 'This question has no correct answer configured.',
    }
  }

  const correctIndex = JSON.parse(question.correctAnswer) as number
  const isCorrect = selectedIndex === correctIndex

  if (isCorrect) {
    return {
      score: 10,
      feedback: 'Correct! Well done.',
      isCorrect: true,
    }
  }

  const options = question.options
    ? (JSON.parse(question.options) as string[])
    : []
  const correctOption = options[correctIndex] || 'the correct answer'

  return {
    score: 0,
    feedback: `Not quite. The correct answer is: ${correctOption}`,
    isCorrect: false,
  }
}

/**
 * Grade a ranking question (auto-graded)
 */
function gradeRanking(
  question: { correctAnswer: string | null; options: string | null },
  userOrder: number[]
): GradeResult {
  if (question.correctAnswer === null) {
    return {
      score: 0,
      feedback: 'This question has no correct order configured.',
    }
  }

  const correctOrder = JSON.parse(question.correctAnswer) as number[]

  // Calculate score based on how many items are in the correct position
  let correctPositions = 0
  for (let i = 0; i < userOrder.length; i++) {
    if (userOrder[i] === correctOrder[i]) {
      correctPositions++
    }
  }

  const percentCorrect = (correctPositions / correctOrder.length) * 100
  const score = Math.round(percentCorrect / 10) // Convert to 1-10 scale

  const isCorrect = correctPositions === correctOrder.length

  if (isCorrect) {
    return {
      score: 10,
      feedback: 'Perfect! You got the correct order.',
      isCorrect: true,
    }
  }

  return {
    score,
    feedback: `You got ${correctPositions} out of ${correctOrder.length} items in the correct position. Review the exemplary answer to see the optimal order.`,
    isCorrect: false,
  }
}

/**
 * Grade a free text or framework application question using AI
 */
async function gradeWithAI(
  question: {
    text: string
    rubric: string | null
    exemplaryAnswer: string | null
    frameworkType: string | null
    type: string
  },
  response: string
): Promise<GradeResult> {
  // If no rubric, provide basic feedback
  if (!question.rubric) {
    return {
      score: 5,
      feedback:
        'Your response has been recorded. Review the exemplary answer to compare your analysis.',
    }
  }

  try {
    const rubric = JSON.parse(question.rubric) as GradingRubric
    const provider = getAIProvider()

    const gradingResult = await provider.gradeResponse({
      questionText: question.text,
      questionType: question.type as 'free_text' | 'framework_application',
      rubric,
      exemplaryAnswer: question.exemplaryAnswer || '',
      studentResponse: response,
      frameworkType: question.frameworkType || undefined,
    })

    // Build feedback string from the grading result
    const feedbackParts: string[] = []

    if (gradingResult.feedback.strengths.length > 0) {
      feedbackParts.push(
        `Strengths: ${gradingResult.feedback.strengths.join('; ')}`
      )
    }

    if (gradingResult.feedback.areasForImprovement.length > 0) {
      feedbackParts.push(
        `Areas for improvement: ${gradingResult.feedback.areasForImprovement.join('; ')}`
      )
    }

    feedbackParts.push(gradingResult.feedback.summary)

    return {
      score: gradingResult.score,
      feedback: feedbackParts.join('\n\n'),
    }
  } catch (error) {
    console.error('AI grading error:', error)
    // Fallback if AI grading fails
    return {
      score: 5,
      feedback:
        'Your response has been recorded. Our AI grading is temporarily unavailable. Review the exemplary answer to compare your analysis.',
    }
  }
}
