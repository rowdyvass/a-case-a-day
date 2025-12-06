import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const concepts = await prisma.concept.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        description: true,
        difficulty: true,
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })

    // Group by category for easier consumption
    const byCategory = concepts.reduce((acc, concept) => {
      if (!acc[concept.category]) {
        acc[concept.category] = []
      }
      acc[concept.category].push(concept)
      return acc
    }, {} as Record<string, typeof concepts>)

    return NextResponse.json({
      concepts,
      byCategory,
      total: concepts.length
    })
  } catch (error) {
    console.error('Error fetching concepts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch concepts' },
      { status: 500 }
    )
  }
}


