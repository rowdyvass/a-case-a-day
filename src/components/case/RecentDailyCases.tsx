import Link from 'next/link'
import { Card } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { Clock, Building2, Calendar, ChevronRight } from 'lucide-react'

interface Concept {
  id: string
  name: string
}

interface DailyCase {
  id: string
  slug: string
  title: string
  company: string
  industry: string
  summary: string
  publishedAt: Date | null
  publishedDate: Date | null
  featuredImage: string | null
  concepts: { concept: Concept }[]
}

interface RecentDailyCasesProps {
  cases: DailyCase[]
}

export function RecentDailyCases({ cases }: RecentDailyCasesProps) {
  if (cases.length === 0) {
    return null
  }

  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Recent Daily Cases
          </h2>
          <p className="text-slate-600 mt-1">
            Catch up on cases from the past two weeks
          </p>
        </div>
        <Link 
          href="/cases?category=daily"
          className="flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative -mx-4 px-4">
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {cases.map((caseItem, index) => (
            <Link
              key={caseItem.id}
              href={`/cases/${caseItem.slug}`}
              className="flex-shrink-0 w-80 snap-start animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Card className="h-full group hover:border-amber-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
                {/* Featured Image - taller for better visibility */}
                {caseItem.featuredImage ? (
                  <div 
                    className="h-44 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${caseItem.featuredImage})` }}
                  >
                    {/* Date overlay on image */}
                    {caseItem.publishedDate && (
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(caseItem.publishedDate)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-24 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                    {caseItem.publishedDate && (
                      <div className="flex items-center gap-1.5 text-amber-600 text-sm font-medium">
                        <Calendar className="h-4 w-4" />
                        {formatDate(caseItem.publishedDate)}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="p-5">
                  {/* Industry Tag */}
                  <span className="inline-block px-2 py-0.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600 mb-3">
                    {caseItem.industry}
                  </span>
                  
                  {/* Title */}
                  <h3 className="font-serif text-lg font-semibold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                    {caseItem.title}
                  </h3>
                  
                  {/* Summary */}
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                    {caseItem.summary}
                  </p>
                  
                  {/* Concepts */}
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
                
                {/* Footer */}
                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    {caseItem.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {caseItem.publishedAt ? formatDate(caseItem.publishedAt) : 'Draft'}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

