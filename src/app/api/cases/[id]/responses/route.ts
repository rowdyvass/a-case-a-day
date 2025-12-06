import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * Get all of user's responses for questions in a case
 * GET /api/cases/[id]/responses
 */
export async function GET(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json(
      { responses: {}, isAuthenticated: false }
    )
  }

  const { id: caseId } = await params
  const userId = (session.user as { id: string }).id

  try {
    // Get all questions for this case
    const questions = await prisma.question.findMany({
      where: { caseId },
      select: { id: true }
    })

    const questionIds = questions.map(q => q.id)

    // Get user's responses for these questions
    const responses = await prisma.questionResponse.findMany({
      where: {
        questionId: { in: questionIds },
        userId
      }
    })

    // Build a map of questionId -> response
    const responseMap: Record<string, {
      response: unknown
      score: number | null
      feedback: string | null
      gradedAt: Date | null
    }> = {}

    for (const r of responses) {
      responseMap[r.questionId] = {
        response: JSON.parse(r.response),
        score: r.score,
        feedback: r.feedback,
        gradedAt: r.gradedAt
      }
    }

    // Calculate progress
    const totalQuestions = questions.length
    const answeredQuestions = responses.length
    const averageScore = responses.length > 0
      ? responses.reduce((sum, r) => sum + (r.score || 0), 0) / responses.length
      : null

    return NextResponse.json({
      responses: responseMap,
      isAuthenticated: true,
      progress: {
        total: totalQuestions,
        answered: answeredQuestions,
        averageScore
      }
    })
  } catch (error) {
    console.error('Get case responses error:', error)
    return NextResponse.json(
      { error: 'Failed to get responses' },
      { status: 500 }
    )
  }
}


