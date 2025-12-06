import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params
  
  const caseData = await prisma.case.findUnique({
    where: { id },
    include: {
      sourceArticles: true,
      exhibits: { orderBy: { order: 'asc' } },
      questions: { orderBy: { order: 'asc' } },
      concepts: { include: { concept: true } }
    }
  })

  if (!caseData) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  }

  return NextResponse.json(caseData)
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const {
    title,
    company,
    industry,
    summary,
    content,
    status,
    conceptIds,
    questions,
    // Category fields
    category,
    publishedDate,
    track,
    skill,
    difficulty,
  } = body

  try {
    // Update the main case
    const updatedCase = await prisma.case.update({
      where: { id },
      data: {
        title,
        company,
        industry,
        summary,
        content: JSON.stringify(content),
        status,
        publishedAt: status === 'published' ? new Date() : undefined,
        // Category fields
        category,
        publishedDate: publishedDate ? new Date(publishedDate) : null,
        track,
        skill,
        difficulty,
      }
    })

    // Update concepts
    if (conceptIds) {
      // Remove existing concept links
      await prisma.caseConcept.deleteMany({
        where: { caseId: id }
      })

      // Add new concept links
      if (conceptIds.length > 0) {
        await prisma.caseConcept.createMany({
          data: conceptIds.map((conceptId: string) => ({
            caseId: id,
            conceptId
          }))
        })
      }
    }

    // Update questions
    if (questions) {
      // Delete existing questions
      await prisma.question.deleteMany({
        where: { caseId: id }
      })

      // Create new questions
      await prisma.question.createMany({
        data: questions.map((q: { text: string; difficulty: string }, index: number) => ({
          caseId: id,
          text: q.text,
          difficulty: q.difficulty,
          order: index
        }))
      })
    }

    return NextResponse.json(updatedCase)
  } catch (error) {
    console.error('Update case error:', error)
    return NextResponse.json(
      { error: 'Failed to update case' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    await prisma.case.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete case error:', error)
    return NextResponse.json(
      { error: 'Failed to delete case' },
      { status: 500 }
    )
  }
}


