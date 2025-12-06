import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'

/**
 * GET /api/prompts/[id] - Get a specific prompt version
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const prompt = await prisma.promptVersion.findUnique({
      where: { id },
    })

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    return NextResponse.json(prompt)
  } catch (error) {
    console.error('Error fetching prompt:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prompt' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/prompts/[id] - Update a prompt version
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, content, systemPrompt, description } = body

    const existing = await prisma.promptVersion.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    if (existing.isActive) {
      return NextResponse.json(
        { error: 'Cannot edit an active prompt. Create a new version instead.' },
        { status: 400 }
      )
    }

    const prompt = await prisma.promptVersion.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(content && { content }),
        ...(systemPrompt !== undefined && { systemPrompt }),
        ...(description !== undefined && { description }),
      },
    })

    return NextResponse.json(prompt)
  } catch (error) {
    console.error('Error updating prompt:', error)
    return NextResponse.json(
      { error: 'Failed to update prompt' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/prompts/[id] - Delete a prompt version
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.promptVersion.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    if (existing.isActive) {
      return NextResponse.json(
        { error: 'Cannot delete an active prompt' },
        { status: 400 }
      )
    }

    await prisma.promptVersion.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting prompt:', error)
    return NextResponse.json(
      { error: 'Failed to delete prompt' },
      { status: 500 }
    )
  }
}

