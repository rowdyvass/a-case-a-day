import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * Get user's existing response for a question
 * GET /api/questions/[id]/response
 */
export async function GET(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Please log in to view your responses', requiresAuth: true },
      { status: 401 }
    )
  }

  const { id: questionId } = await params
  const userId = (session.user as { id: string }).id

  try {
    const response = await prisma.questionResponse.findUnique({
      where: {
        questionId_userId: {
          questionId,
          userId
        }
      },
      include: {
        question: {
          select: {
            exemplaryAnswer: true
          }
        }
      }
    })

    if (!response) {
      return NextResponse.json({ response: null })
    }

    return NextResponse.json({
      response: {
        id: response.id,
        response: JSON.parse(response.response),
        score: response.score,
        feedback: response.feedback,
        gradedAt: response.gradedAt,
        exemplaryAnswer: response.question.exemplaryAnswer
      }
    })
  } catch (error) {
    console.error('Get response error:', error)
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    )
  }
}

/**
 * Delete user's response for a question (to retry)
 * DELETE /api/questions/[id]/response
 */
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Please log in to manage your responses', requiresAuth: true },
      { status: 401 }
    )
  }

  const { id: questionId } = await params
  const userId = (session.user as { id: string }).id

  try {
    await prisma.questionResponse.delete({
      where: {
        questionId_userId: {
          questionId,
          userId
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    // If not found, that's okay
    return NextResponse.json({ success: true })
  }
}


