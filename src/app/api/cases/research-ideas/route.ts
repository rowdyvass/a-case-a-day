import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { getAIProvider } from '@/lib/ai'
import type { BulkResearchCriteria } from '@/lib/ai/providers/types'

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { company, concept, path, year, count } = body as BulkResearchCriteria

    // Validate that at least one filter is provided
    if (!company && !concept && !path && !year) {
      return NextResponse.json(
        { error: 'At least one filter (company, concept, path, or year) is required' },
        { status: 400 }
      )
    }

    // Get AI provider
    const provider = getAIProvider()

    console.log('Researching case ideas with criteria:', { company, concept, path, year, count })
    
    const result = await provider.researchCaseIdeas({
      company,
      concept,
      path,
      year,
      count: count || 10
    })

    console.log(`Found ${result.caseIdeas.length} case ideas`)

    return NextResponse.json({
      caseIdeas: result.caseIdeas,
      criteria: { company, concept, path, year },
      count: result.caseIdeas.length
    })
  } catch (error) {
    console.error('Research ideas error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to research case ideas' },
      { status: 500 }
    )
  }
}


