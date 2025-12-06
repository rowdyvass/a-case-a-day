import { prisma } from '@/lib/db'
import { ConceptCard } from '@/components/concept/ConceptCard'
import { ConceptFilters } from '@/components/concept/ConceptFilters'
import { Brain, Lightbulb } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Concept Library | A Case A Day',
  description: 'Master MBA frameworks and business concepts through interactive learning. Explore 60+ concepts across Strategy, Finance, Marketing, Operations, Leadership, and Economics.'
}

export const dynamic = 'force-dynamic'

interface SearchParams {
  category?: string
  difficulty?: string
  search?: string
}

export default async function ConceptsPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { category, difficulty, search } = params

  // Build where clause
  const where: Record<string, unknown> = {}

  if (category) {
    where.category = category
  }

  if (difficulty) {
    where.difficulty = difficulty
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } }
    ]
  }

  const concepts = await prisma.concept.findMany({
    where,
    orderBy: [
      { category: 'asc' },
      { name: 'asc' }
    ],
    include: {
      _count: {
        select: { cases: true }
      }
    }
  })

  // Get unique categories and difficulties for filters
  const allConcepts = await prisma.concept.findMany({
    select: {
      category: true,
      difficulty: true
    }
  })

  const categories = [...new Set(allConcepts.map(c => c.category))].sort()
  const difficulties = ['beginner', 'intermediate', 'advanced']

  // Group concepts by category for display
  const conceptsByCategory = concepts.reduce((acc, concept) => {
    if (!acc[concept.category]) {
      acc[concept.category] = []
    }
    acc[concept.category].push(concept)
    return acc
  }, {} as Record<string, typeof concepts>)

  const categoryOrder = ['Strategy', 'Finance', 'Marketing', 'Operations', 'Leadership', 'Economics']

  // Stats
  const stats = {
    total: concepts.length,
    byCategory: categories.map(cat => ({
      name: cat,
      count: concepts.filter(c => c.category === cat).length
    }))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 mb-6">
          <Lightbulb className="h-4 w-4" />
          <span>Interactive Learning</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
          Concept Library
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Master essential business frameworks through interactive explanations, 
          visual diagrams, and hands-on exercises. Each concept links to real case studies.
        </p>
        
        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-8 mt-8 pt-8 border-t border-slate-200">
          <div className="text-center">
            <div className="font-serif text-2xl font-bold text-slate-900">{allConcepts.length}</div>
            <div className="text-sm text-slate-500">Concepts</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-2xl font-bold text-slate-900">6</div>
            <div className="text-sm text-slate-500">Categories</div>
          </div>
          <div className="text-center">
            <div className="font-serif text-2xl font-bold text-amber-600">Interactive</div>
            <div className="text-sm text-slate-500">Exercises</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {/* Filters */}
        <ConceptFilters
          categories={categories}
          difficulties={difficulties}
          currentCategory={category}
          currentDifficulty={difficulty}
          currentSearch={search}
        />

        {/* Results */}
        {concepts.length === 0 ? (
          <div className="text-center py-16">
            <Brain className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-semibold text-slate-700 mb-2">
              No concepts found
            </h3>
            <p className="text-slate-500">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="text-center mb-8">
              <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-700">{concepts.length}</span> concept{concepts.length !== 1 ? 's' : ''}
                {category && <> in <span className="font-semibold text-slate-700">{category}</span></>}
              </p>
            </div>

            {/* Grouped by Category or Flat List */}
            {!category && !search ? (
              // Grouped display
              <div className="space-y-12">
                {categoryOrder
                  .filter(cat => conceptsByCategory[cat]?.length > 0)
                  .map((cat) => (
                    <section key={cat}>
                      <div className="flex items-center gap-3 mb-6">
                        <h2 className="font-serif text-2xl font-bold text-slate-900">{cat}</h2>
                        <div className="h-px flex-1 bg-slate-200" />
                        <span className="text-sm text-slate-500">{conceptsByCategory[cat].length} concepts</span>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {conceptsByCategory[cat].map((concept, index) => (
                          <ConceptCard
                            key={concept.id}
                            slug={concept.slug}
                            name={concept.name}
                            category={concept.category}
                            description={concept.description || ''}
                            difficulty={concept.difficulty}
                            caseCount={concept._count.cases}
                            index={index}
                          />
                        ))}
                      </div>
                    </section>
                  ))}
              </div>
            ) : (
              // Flat grid for filtered results
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {concepts.map((concept, index) => (
                  <ConceptCard
                    key={concept.id}
                    slug={concept.slug}
                    name={concept.name}
                    category={concept.category}
                    description={concept.description || ''}
                    difficulty={concept.difficulty}
                    caseCount={concept._count.cases}
                    index={index}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}


