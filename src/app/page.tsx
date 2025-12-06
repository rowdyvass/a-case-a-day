import Link from 'next/link'
import Image from 'next/image'
import { LinkButton } from '@/components/ui/link-button'
import { ArrowRight, BookOpen, Brain, Building2, Sparkles, Clock, ChevronRight } from 'lucide-react'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Fetch featured cases for the preview (include featuredImage)
  const featuredCases = await prisma.case.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
    take: 6,
    include: {
      concepts: {
        include: { concept: true },
        take: 2
      }
    }
  })

  const heroCase = featuredCases[0]
  const recentCases = featuredCases.slice(1, 5)

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Navigation */}
      <nav className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-sm">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-serif text-xl font-semibold text-stone-900">A Case A Day</span>
            </Link>
            <div className="flex items-center gap-8">
              <Link href="/cases" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
                Cases
              </Link>
              <Link href="/concepts" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
                Concepts
              </Link>
              <LinkButton href="/cases" variant="primary" size="sm" className="hidden sm:flex">
                Start Learning
              </LinkButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Featured Case Showcase */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 via-white to-[#FAFAF8]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          {/* Top intro text */}
          <div className="text-center mb-10 lg:mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-4 py-1.5 text-sm font-medium text-amber-800 mb-6 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span>Publication-Quality MBA Case Studies</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-900 leading-[1.1] mb-5 max-w-4xl mx-auto">
              Learn Business by<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-500">Doing Business</span>
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Interactive case studies with real-world scenarios, graded questions, 
              and 60+ business frameworks to master.
            </p>
          </div>

          {/* Featured Case Hero Card */}
          {heroCase && (
            <Link href={`/cases/${heroCase.slug}`} className="block group">
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl shadow-stone-200/50 border border-stone-200/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-200/30 hover:border-amber-200">
                <div className="grid lg:grid-cols-2">
                  {/* Image Side */}
                  <div className="relative h-64 sm:h-80 lg:h-[420px] overflow-hidden">
                    {heroCase.featuredImage ? (
                      <>
                        <Image
                          src={heroCase.featuredImage}
                          alt={heroCase.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-white/10" />
                      </>
                    ) : (
                      <div 
                        className="absolute inset-0"
                        style={{ 
                          background: heroCase.brandColor 
                            ? `linear-gradient(135deg, ${heroCase.brandColor}ee, ${heroCase.brandColor}aa)`
                            : 'linear-gradient(135deg, #1e293b, #0f172a)'
                        }}
                      >
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }} />
                      </div>
                    )}
                    
                    {/* Featured badge on image */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        Featured Case
                      </span>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                    {/* Industry & Concepts */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                        {heroCase.industry}
                      </span>
                      {heroCase.concepts.slice(0, 2).map(({ concept }) => (
                        <span 
                          key={concept.id}
                          className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full"
                        >
                          {concept.name}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 mb-4 leading-tight group-hover:text-amber-700 transition-colors">
                      {heroCase.title}
                    </h2>

                    {/* Summary */}
                    <p className="text-stone-600 text-base sm:text-lg leading-relaxed mb-6 line-clamp-3">
                      {heroCase.summary}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 mb-6">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4" />
                        {heroCase.company}
                      </span>
                      {heroCase.publishedAt && (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {formatDate(heroCase.publishedAt)}
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-amber-600 font-semibold group-hover:text-amber-700 transition-colors">
                      Start This Case
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-10 lg:mt-14">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-stone-900">200+</div>
                <div className="text-sm text-stone-500">Case Studies</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-stone-800 flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-stone-900">60</div>
                <div className="text-sm text-stone-500">Frameworks</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-stone-900">Daily</div>
                <div className="text-sm text-stone-500">New Cases</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Cases Section */}
      {recentCases.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Recent Cases</h2>
                <p className="text-stone-500 mt-1">Explore the latest business challenges</p>
              </div>
              <Link 
                href="/cases" 
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors group"
              >
                View All Cases
                <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Cases Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentCases.map((caseItem, index) => (
                <Link
                  key={caseItem.id}
                  href={`/cases/${caseItem.slug}`}
                  className="group animate-fade-in-up"
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <div className="bg-white rounded-xl border border-stone-200 overflow-hidden h-full flex flex-col hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      {caseItem.featuredImage ? (
                        <Image
                          src={caseItem.featuredImage}
                          alt={caseItem.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div 
                          className="absolute inset-0"
                          style={{ 
                            background: caseItem.brandColor 
                              ? `linear-gradient(135deg, ${caseItem.brandColor}dd, ${caseItem.brandColor}99)`
                              : 'linear-gradient(135deg, #475569, #1e293b)'
                          }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Building2 className="h-10 w-10 text-white/30" />
                          </div>
                        </div>
                      )}
                      
                      {/* Industry Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-stone-700 text-[10px] font-semibold rounded-full uppercase tracking-wide shadow-sm">
                          {caseItem.industry}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug">
                        {caseItem.title}
                      </h3>
                      
                      <p className="text-sm text-stone-500 line-clamp-2 mb-3 flex-1">
                        {caseItem.summary}
                      </p>

                      {/* Concepts */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {caseItem.concepts.slice(0, 2).map(({ concept }) => (
                          <span
                            key={concept.id}
                            className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full"
                          >
                            {concept.name}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-stone-400 pt-3 border-t border-stone-100">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {caseItem.company}
                        </span>
                        {caseItem.publishedAt && (
                          <span>{formatDate(caseItem.publishedAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile View All Link */}
            <div className="sm:hidden mt-6 text-center">
              <Link 
                href="/cases" 
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700"
              >
                View All Cases
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
            <div className="text-center lg:text-left">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Ready to Think Like a
                <span className="text-amber-400"> Business Leader?</span>
              </h2>
              <p className="text-stone-400 text-lg max-w-xl mx-auto lg:mx-0">
                Start with today&apos;s case and build your strategic thinking skills one challenge at a time.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <LinkButton href="/cases" variant="primary" size="lg" className="shadow-lg shadow-amber-600/20">
                Browse Cases <ArrowRight className="h-5 w-5" />
              </LinkButton>
              <LinkButton 
                href="/concepts" 
                variant="secondary" 
                size="lg"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
              >
                Explore Concepts <BookOpen className="h-5 w-5" />
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-serif text-lg font-semibold text-stone-900">A Case A Day</span>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/cases" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
                Cases
              </Link>
              <Link href="/concepts" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
                Concepts
              </Link>
            </div>
            <p className="text-sm text-stone-400">
              © {new Date().getFullYear()} A Case A Day
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
