import Link from 'next/link'
import { Badge } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { Clock, Building2, ArrowRight, Calendar, Sparkles } from 'lucide-react'

interface Concept {
  id: string
  name: string
}

interface CaseWithConcepts {
  id: string
  slug: string
  title: string
  company: string
  industry: string
  summary: string
  publishedAt: Date | null
  publishedDate: Date | null
  brandColor: string | null
  featuredImage: string | null
  concepts: { concept: Concept }[]
}

interface TodaysCaseHeroProps {
  todaysCase: CaseWithConcepts | null
}

export function TodaysCaseHero({ todaysCase }: TodaysCaseHeroProps) {
  if (!todaysCase) {
    return (
      <div className="mb-12">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 p-8 md:p-12 border border-slate-200">
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h2 className="font-serif text-xl font-semibold text-slate-600 mb-2">
              No Case Today
            </h2>
            <p className="text-slate-500">
              Check back tomorrow for a new daily case study.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Use brand color if available, otherwise default gradient
  const hasCustomColor = todaysCase.brandColor && todaysCase.brandColor !== '#000000'
  const hasFeaturedImage = !!todaysCase.featuredImage
  const bgStyle = hasCustomColor
    ? { background: `linear-gradient(135deg, ${todaysCase.brandColor}ee, ${todaysCase.brandColor}cc)` }
    : undefined

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-amber-500" />
        <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide">
          Today&apos;s Case
        </p>
        {todaysCase.publishedDate && (
          <span className="text-sm text-slate-500">
            • {formatDate(todaysCase.publishedDate)}
          </span>
        )}
      </div>
      
      <Link href={`/cases/${todaysCase.slug}`}>
        <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 transition-all duration-300 hover:shadow-2xl hover:border-slate-300">
          {/* Split Layout: Image on right, content on left */}
          <div className="flex flex-col lg:flex-row">
            {/* Content Side */}
            <div 
              className={`flex-1 p-8 md:p-10 lg:p-12 text-white ${
                hasCustomColor ? '' : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
              }`}
              style={hasCustomColor ? { background: todaysCase.brandColor! } : undefined}
            >
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Badge variant="primary" className="bg-white/20 text-white border-white/30">
                  {todaysCase.industry}
                </Badge>
                {todaysCase.concepts.slice(0, 3).map(({ concept }) => (
                  <Badge 
                    key={concept.id} 
                    variant="secondary" 
                    className="bg-white/10 text-white/90 border-white/20"
                  >
                    {concept.name}
                  </Badge>
                ))}
              </div>
              
              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-4 group-hover:text-amber-200 transition-colors leading-tight">
                {todaysCase.title}
              </h2>
              
              {/* Summary */}
              <p className="text-base md:text-lg text-white/80 mb-6 leading-relaxed line-clamp-3">
                {todaysCase.summary}
              </p>
              
              {/* Meta and CTA */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-auto">
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {todaysCase.company}
                  </span>
                  {todaysCase.publishedAt && (
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {formatDate(todaysCase.publishedAt)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm font-semibold text-white group-hover:text-amber-200 transition-colors">
                  Start Case
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            {/* Image Side */}
            {hasFeaturedImage && (
              <div className="lg:w-[45%] relative">
                <div 
                  className="h-48 sm:h-56 lg:h-full lg:min-h-[320px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${todaysCase.featuredImage})` }}
                />
              </div>
            )}
            
            {/* Decorative pattern when no image */}
            {!hasFeaturedImage && (
              <div className="hidden lg:block lg:w-[35%] bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl" />
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

