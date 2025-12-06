import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'

/**
 * POST /api/prompts/[id]/activate - Activate a prompt version
 */
export async function POST(
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

    // Deactivate all other versions of this type
    await prisma.promptVersion.updateMany({
      where: {
        promptType: prompt.promptType,
        isActive: true,
      },
      data: { isActive: false },
    })

    // Activate this version
    const updated = await prisma.promptVersion.update({
      where: { id },
      data: { isActive: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error activating prompt:', error)
    return NextResponse.json(
      { error: 'Failed to activate prompt' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/prompts/[id]/activate - Deactivate a prompt version
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

    const prompt = await prisma.promptVersion.findUnique({
      where: { id },
    })

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    const updated = await prisma.promptVersion.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error deactivating prompt:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate prompt' },
      { status: 500 }
    )
  }
}

