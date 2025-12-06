import { prisma } from '@/lib/db'
import { TodaysCaseHero } from '@/components/case/TodaysCaseHero'
import { RecentDailyCases } from '@/components/case/RecentDailyCases'
import { ClassicCasesLibrary } from '@/components/case/ClassicCasesLibrary'

export const dynamic = 'force-dynamic'

interface SearchParams {
  industry?: string
  concept?: string
  track?: string
  skill?: string
  difficulty?: string
  search?: string
  category?: string
}

export default async function CasesPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { industry, concept, track, skill, difficulty, search, category } = params

  // Get today's date (start of day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Fetch today's daily case (where publishedDate = today)
  const todaysCase = await prisma.case.findFirst({
    where: {
      status: 'published',
      category: 'daily',
      publishedDate: {
        gte: today,
        lt: tomorrow,
      },
    },
    select: {
      id: true,
      slug: true,
      title: true,
      company: true,
      industry: true,
      summary: true,
      publishedAt: true,
      publishedDate: true,
      brandColor: true,
      featuredImage: true,
      concepts: {
        include: { concept: true }
      }
    }
  })

  // Fallback: If no case for today, get the most recent daily case (by publishedDate or publishedAt)
  const fallbackTodaysCase = !todaysCase 
    ? await prisma.case.findFirst({
        where: {
          status: 'published',
          category: 'daily',
        },
        orderBy: [
          { publishedDate: 'desc' },
          { publishedAt: 'desc' },
        ],
        select: {
          id: true,
          slug: true,
          title: true,
          company: true,
          industry: true,
          summary: true,
          publishedAt: true,
          publishedDate: true,
          brandColor: true,
          featuredImage: true,
          concepts: {
            include: { concept: true }
          }
        }
      })
    : null

  const heroCase = todaysCase || fallbackTodaysCase

  // Fetch recent daily cases (excluding today's featured case)
  // Include cases with publishedDate in past 14 days OR recent cases without publishedDate
  const fourteenDaysAgo = new Date()
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
  
  const recentDailyCases = await prisma.case.findMany({
    where: {
      status: 'published',
      category: 'daily',
      id: heroCase ? { not: heroCase.id } : undefined,
      OR: [
        { publishedDate: { gte: fourteenDaysAgo } },
        { publishedDate: null, publishedAt: { gte: fourteenDaysAgo } },
      ],
    },
    orderBy: [
      { publishedDate: 'desc' },
      { publishedAt: 'desc' },
    ],
    take: 10,
    select: {
      id: true,
      slug: true,
      title: true,
      company: true,
      industry: true,
      summary: true,
      publishedAt: true,
      publishedDate: true,
      featuredImage: true,
      concepts: {
        include: { concept: true }
      }
    }
  })

  // Fetch ALL daily cases when category=daily filter is active
  const allDailyCases = category === 'daily' ? await prisma.case.findMany({
    where: {
      status: 'published',
      category: 'daily',
    },
    orderBy: [
      { publishedDate: 'desc' },
      { publishedAt: 'desc' },
    ],
    select: {
      id: true,
      slug: true,
      title: true,
      company: true,
      industry: true,
      summary: true,
      publishedAt: true,
      publishedDate: true,
      featuredImage: true,
      concepts: {
        include: { concept: true }
      }
    }
  }) : []

  // Build where clause for canonical cases
  const canonicalWhere: Record<string, unknown> = {
    status: 'published',
    category: 'canonical',
  }

  if (industry) {
    canonicalWhere.industry = industry
  }

  if (concept) {
    canonicalWhere.concepts = {
      some: {
        concept: {
          name: concept
        }
      }
    }
  }

  if (track) {
    canonicalWhere.track = track
  }

  if (skill) {
    canonicalWhere.skill = { contains: skill }
  }

  if (difficulty) {
    canonicalWhere.difficulty = difficulty
  }

  if (search) {
    canonicalWhere.OR = [
      { title: { contains: search } },
      { company: { contains: search } },
      { summary: { contains: search } }
    ]
  }

  // Fetch canonical cases with filters
  const canonicalCases = await prisma.case.findMany({
    where: canonicalWhere,
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      title: true,
      company: true,
      industry: true,
      summary: true,
      publishedAt: true,
      track: true,
      skill: true,
      difficulty: true,
      featuredImage: true,
      concepts: {
        include: { concept: true }
      }
    }
  })

  // Get unique values for filters (from canonical cases only)
  const allCanonicalCases = await prisma.case.findMany({
    where: { 
      status: 'published',
      category: 'canonical',
    },
    select: {
      industry: true,
      track: true,
      skill: true,
      concepts: {
        include: { concept: true }
      }
    }
  })

  const industries = [...new Set(allCanonicalCases.map(c => c.industry))].sort()
  const concepts = [...new Set(allCanonicalCases.flatMap(c => c.concepts.map(cc => cc.concept.name)))].sort()
  const tracks = [...new Set(allCanonicalCases.map(c => c.track).filter(Boolean))].sort() as string[]
  const skills = [...new Set(
    allCanonicalCases
      .map(c => c.skill)
      .filter(Boolean)
      .flatMap(s => s!.split(', '))
  )].sort()

  // Check if we're showing filtered results (should hide the daily sections)
  const hasFilters = industry || concept || track || skill || difficulty || search
  const showingDailyCategory = category === 'daily'

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
          {showingDailyCategory ? 'Daily Cases' : 'Case Studies'}
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          {showingDailyCategory 
            ? 'All daily business cases from the headlines, sorted by date.'
            : 'Practice with daily business cases from the headlines, or explore our library of classic cases for comprehensive learning.'
          }
        </p>
        {showingDailyCategory && (
          <a 
            href="/cases" 
            className="inline-flex items-center gap-1 mt-4 text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            ← Back to all cases
          </a>
        )}
      </div>

      {/* All Daily Cases View */}
      {showingDailyCategory && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allDailyCases.map((caseItem) => (
            <a
              key={caseItem.id}
              href={`/cases/${caseItem.slug}`}
              className="group"
            >
              <div className="h-full bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-amber-200 hover:shadow-lg transition-all duration-200">
                {caseItem.featuredImage ? (
                  <div 
                    className="h-44 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${caseItem.featuredImage})` }}
                  >
                    {caseItem.publishedDate && (
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                        {new Date(caseItem.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-24 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                    {caseItem.publishedDate && (
                      <div className="text-amber-600 text-sm font-medium">
                        {new Date(caseItem.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="p-5">
                  <span className="inline-block px-2 py-0.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600 mb-3">
                    {caseItem.industry}
                  </span>
                  
                  <h3 className="font-serif text-lg font-semibold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                    {caseItem.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {caseItem.summary}
                  </p>
                  
                  <div className="flex flex-wrap gap-1">
                    {caseItem.concepts.slice(0, 2).map(({ concept }) => (
                      <span
                        key={concept.id}
                        className="px-2 py-0.5 bg-amber-50 rounded-full text-xs text-amber-700"
                      >
                        {concept.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="px-5 py-3 border-t border-slate-100 text-sm text-slate-500">
                  {caseItem.company}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Daily Sections - Hidden when filters are active or viewing all daily */}
      {!hasFilters && !showingDailyCategory && (
        <>
          {/* Today's Case Hero */}
          <TodaysCaseHero todaysCase={heroCase} />

          {/* Recent Daily Cases */}
          <RecentDailyCases cases={recentDailyCases} />
        </>
      )}

      {/* Classic Cases Library - Hidden when viewing all daily cases */}
      {!showingDailyCategory && (
        <ClassicCasesLibrary
          cases={canonicalCases}
          industries={industries}
          concepts={concepts}
          tracks={tracks}
          skills={skills}
          currentFilters={{
            industry,
            concept,
            track,
            skill,
            difficulty,
            search,
          }}
        />
      )}
    </div>
  )
}
