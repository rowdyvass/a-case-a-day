import { prisma } from '@/lib/db'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { ConceptChart } from '@/components/operator/ConceptChart'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // Get case statistics
  const [totalCases, publishedCases, draftCases, reviewCases] = await Promise.all([
    prisma.case.count(),
    prisma.case.count({ where: { status: 'published' } }),
    prisma.case.count({ where: { status: 'draft' } }),
    prisma.case.count({ where: { status: 'review' } })
  ])

  // Get concept distribution
  const conceptStats = await prisma.concept.findMany({
    include: {
      _count: {
        select: { cases: true }
      }
    },
    orderBy: {
      cases: {
        _count: 'desc'
      }
    }
  })

  // Get recent cases
  const recentCases = await prisma.case.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      concepts: { include: { concept: true } }
    }
  })

  // Format concept data for chart
  const conceptData = conceptStats.reduce((acc, concept) => {
    const category = concept.category
    if (!acc[category]) {
      acc[category] = { category, count: 0 }
    }
    acc[category].count += concept._count.cases
    return acc
  }, {} as Record<string, { category: string; count: number }>)

  const chartData = Object.values(conceptData)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-600">Overview of your case studies</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Cases"
          value={totalCases}
          icon={<FileText className="h-5 w-5" />}
          color="slate"
        />
        <StatCard
          title="Published"
          value={publishedCases}
          icon={<CheckCircle className="h-5 w-5" />}
          color="emerald"
        />
        <StatCard
          title="In Review"
          value={reviewCases}
          icon={<Clock className="h-5 w-5" />}
          color="amber"
        />
        <StatCard
          title="Drafts"
          value={draftCases}
          icon={<TrendingUp className="h-5 w-5" />}
          color="slate"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Concept Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Concept Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ConceptChart data={chartData} />
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500">
                No data yet. Create cases to see concept distribution.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Cases</CardTitle>
          </CardHeader>
          <CardContent>
            {recentCases.length > 0 ? (
              <div className="space-y-4">
                {recentCases.map((caseItem) => (
                  <Link
                    key={caseItem.id}
                    href={`/operator/cases/${caseItem.id}/edit`}
                    className="block p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{caseItem.title}</p>
                        <p className="text-sm text-slate-500">{caseItem.company}</p>
                      </div>
                      <StatusBadge status={caseItem.status} />
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                      <span>{formatDate(caseItem.createdAt)}</span>
                      {caseItem.concepts.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{caseItem.concepts.length} concepts</span>
                        </>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-slate-500">
                No cases yet. Create your first case to get started.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Concept Details */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Concept Usage Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {conceptStats.slice(0, 12).map((concept) => (
                <div
                  key={concept.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{concept.name}</p>
                    <p className="text-xs text-slate-500">{concept.category}</p>
                  </div>
                  <span className="text-lg font-semibold text-slate-700">
                    {concept._count.cases}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color
}: {
  title: string
  value: number
  icon: React.ReactNode
  color: 'slate' | 'emerald' | 'amber'
}) {
  const colorStyles = {
    slate: 'bg-slate-100 text-slate-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600'
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, 'default' | 'warning' | 'success'> = {
    draft: 'default',
    review: 'warning',
    published: 'success'
  }

  return (
    <Badge variant={variants[status] || 'default'} className="flex-shrink-0">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}


