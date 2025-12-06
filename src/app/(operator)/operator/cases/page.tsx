import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Button, Badge } from '@/components/ui'
import { Plus, Clock, Layers, Newspaper, Library, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { CaseGenerationQueue } from '@/components/operator/CaseGenerationQueue'
import { CaseActions } from '@/components/operator/CaseActions'

export const dynamic = 'force-dynamic'

interface SearchParams {
  category?: string
}

export default async function CasesPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const categoryFilter = params.category // 'all', 'daily', or 'canonical'

  const cases = await prisma.case.findMany({
    where: categoryFilter && categoryFilter !== 'all' ? { category: categoryFilter } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      concepts: {
        include: { concept: true }
      }
    }
  })

  // Get counts for tabs
  const [dailyCount, canonicalCount] = await Promise.all([
    prisma.case.count({ where: { category: 'daily' } }),
    prisma.case.count({ where: { category: 'canonical' } }),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">Cases</h1>
          <p className="mt-1 text-slate-600">Manage your case studies</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/operator/cases/bulk">
            <Button variant="outline" className="gap-2">
              <Layers className="h-4 w-4" />
              Bulk Add
            </Button>
          </Link>
          <Link href="/operator/cases/new">
            <Button variant="primary" className="gap-2">
              <Plus className="h-4 w-4" />
              New Case
            </Button>
          </Link>
        </div>
      </div>

      {/* Generation Queue */}
      <div className="mb-8">
        <CaseGenerationQueue compact showCompleted />
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <Link href="/operator/cases">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !categoryFilter || categoryFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({dailyCount + canonicalCount})
          </button>
        </Link>
        <Link href="/operator/cases?category=daily">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              categoryFilter === 'daily'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Newspaper className="h-4 w-4" />
            Daily ({dailyCount})
          </button>
        </Link>
        <Link href="/operator/cases?category=canonical">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              categoryFilter === 'canonical'
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Library className="h-4 w-4" />
            Canonical ({canonicalCount})
          </button>
        </Link>
      </div>

      {cases.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Plus className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="font-serif text-lg font-semibold text-slate-900 mb-2">No cases yet</h3>
          <p className="text-slate-600 mb-4">Create your first case study to get started.</p>
          <Link href="/operator/cases/new">
            <Button variant="primary" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Case
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CategoryBadge category={caseItem.category} />
                    <StatusBadge status={caseItem.status} />
                    <span className="text-sm text-slate-500">{caseItem.industry}</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-slate-900 mb-1">
                    {caseItem.title}
                  </h3>
                  <p className="text-slate-600 mb-3">{caseItem.company}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(caseItem.createdAt)}
                    </span>
                    {caseItem.category === 'daily' && caseItem.publishedDate && (
                      <span className="flex items-center gap-1 text-amber-600">
                        <Calendar className="h-4 w-4" />
                        Featured: {formatDate(caseItem.publishedDate)}
                      </span>
                    )}
                    {caseItem.category === 'canonical' && caseItem.track && (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                        {caseItem.track}
                      </span>
                    )}
                    {caseItem.concepts.length > 0 && (
                      <div className="flex items-center gap-1">
                        {caseItem.concepts.slice(0, 3).map(({ concept }) => (
                          <Badge key={concept.id} variant="secondary" className="text-xs">
                            {concept.name}
                          </Badge>
                        ))}
                        {caseItem.concepts.length > 3 && (
                          <span className="text-slate-400">+{caseItem.concepts.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <CaseActions
                  caseId={caseItem.id}
                  caseSlug={caseItem.slug}
                  status={caseItem.status}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryBadge({ category }: { category: string }) {
  if (category === 'daily') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
        <Newspaper className="h-3 w-3" />
        Daily
      </span>
    )
  }
  if (category === 'canonical') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
        <Library className="h-3 w-3" />
        Canonical
      </span>
    )
  }
  return null
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, 'default' | 'warning' | 'success'> = {
    draft: 'default',
    review: 'warning',
    published: 'success'
  }

  return (
    <Badge variant={variants[status] || 'default'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

