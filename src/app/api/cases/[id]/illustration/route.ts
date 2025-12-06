import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { regenerateIllustration } from '@/lib/cases'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Regenerate the illustration
    const result = await regenerateIllustration(id)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      imagePath: result.imagePath,
      illustrationPrompt: result.illustrationPrompt,
    })
  } catch (error) {
    console.error('Illustration regeneration error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to regenerate illustration' },
      { status: 500 }
    )
  }
}

