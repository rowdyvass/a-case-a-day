import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import type { PromptType } from '@/lib/prompts/registry'

/**
 * GET /api/prompts - List all prompts with optional type filter
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const promptType = searchParams.get('type') as PromptType | null
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const where: Record<string, unknown> = {}
    if (promptType) {
      where.promptType = promptType
    }
    if (activeOnly) {
      where.isActive = true
    }

    const prompts = await prisma.promptVersion.findMany({
      where,
      orderBy: [
        { promptType: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    // Group by type for easier consumption
    const grouped = prompts.reduce((acc, prompt) => {
      if (!acc[prompt.promptType]) {
        acc[prompt.promptType] = []
      }
      acc[prompt.promptType].push(prompt)
      return acc
    }, {} as Record<string, typeof prompts>)

    return NextResponse.json({ prompts, grouped })
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/prompts - Create a new prompt version
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { promptType, name, content, systemPrompt, description } = body

    if (!promptType || !content) {
      return NextResponse.json(
        { error: 'promptType and content are required' },
        { status: 400 }
      )
    }

    // Get the next version number
    const latestVersion = await prisma.promptVersion.findFirst({
      where: { promptType },
      orderBy: { version: 'desc' },
    })

    const nextVersion = incrementVersion(latestVersion?.version || '0.0.0')

    const prompt = await prisma.promptVersion.create({
      data: {
        promptType,
        version: nextVersion,
        name: name || `${promptType} v${nextVersion}`,
        content,
        systemPrompt,
        description,
        createdBy: (session.user as { id: string }).id,
        isActive: false,
      },
    })

    return NextResponse.json(prompt)
  } catch (error) {
    console.error('Error creating prompt:', error)
    return NextResponse.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
    )
  }
}

function incrementVersion(version: string): string {
  const parts = version.split('.').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) {
    return '1.0.0'
  }
  parts[2]++
  return parts.join('.')
}

