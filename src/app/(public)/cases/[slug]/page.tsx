import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Badge } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Building2, Calendar } from 'lucide-react'
import { ExhibitRenderer } from '@/components/case/ExhibitRenderer'
import { QuestionList } from '@/components/case/QuestionList'
import { CaseActions } from '@/components/case/CaseActions'
import { getConceptBadgeVariant } from '@/components/ui/badge'
import { ReactNode } from 'react'

interface PageProps {
  params: Promise<{ slug: string }>
}

/**
 * Parse basic markdown formatting into React elements
 * Handles: *italic*, **bold**, "smart quotes"
 */
function parseMarkdown(text: string): ReactNode[] {
  const elements: ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Check for bold (**text**)
    const boldMatch = remaining.match(/^\*\*(.+?)\*\*/)
    if (boldMatch) {
      elements.push(<strong key={key++} className="font-semibold">{parseMarkdown(boldMatch[1])}</strong>)
      remaining = remaining.slice(boldMatch[0].length)
      continue
    }

    // Check for italic (*text*) - but not ** which is bold
    const italicMatch = remaining.match(/^\*([^*]+?)\*/)
    if (italicMatch) {
      elements.push(<em key={key++} className="italic">{parseMarkdown(italicMatch[1])}</em>)
      remaining = remaining.slice(italicMatch[0].length)
      continue
    }

    // Check for em dash
    if (remaining.startsWith('—') || remaining.startsWith('--')) {
      const dashLength = remaining.startsWith('—') ? 1 : 2
      elements.push(<span key={key++}>—</span>)
      remaining = remaining.slice(dashLength)
      continue
    }

    // Find the next special character
    const nextSpecial = remaining.search(/\*|—|--/)
    if (nextSpecial === -1) {
      // No more special characters, add remaining text
      elements.push(remaining)
      break
    } else if (nextSpecial === 0) {
      // Special char at start but didn't match patterns, just add it
      elements.push(remaining[0])
      remaining = remaining.slice(1)
    } else {
      // Add text before special character
      elements.push(remaining.slice(0, nextSpecial))
      remaining = remaining.slice(nextSpecial)
    }
  }

  return elements
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const caseData = await prisma.case.findUnique({
    where: { slug },
    select: { title: true, summary: true, company: true, status: true }
  })

  if (!caseData) return { title: 'Case Not Found' }

  return {
    title: `${caseData.status === 'draft' ? '[DRAFT] ' : ''}${caseData.title} | A Case A Day`,
    description: caseData.summary
  }
}

export default async function CaseViewerPage({ params }: PageProps) {
  const { slug } = await params
  
  // Allow viewing both published and draft cases (drafts are for operator preview)
  const caseData = await prisma.case.findUnique({
    where: { slug },
    include: {
      exhibits: { orderBy: { order: 'asc' } },
      questions: { orderBy: { order: 'asc' } },
      concepts: { 
        include: { 
          concept: {
            select: {
              id: true,
              slug: true,
              name: true,
              category: true
            }
          } 
        } 
      }
    }
  })

  if (!caseData) {
    notFound()
  }

  // Safely parse content - handle both object and array formats
  let sections: { title: string; content: string }[] = []
  try {
    const parsed = caseData.content ? JSON.parse(caseData.content) : null
    if (Array.isArray(parsed)) {
      // Legacy format: content is a direct array
      sections = parsed
    } else if (parsed?.sections && Array.isArray(parsed.sections)) {
      // New format: content is an object with sections property
      sections = parsed.sections
    }
  } catch (e) {
    console.error('Failed to parse case content:', e)
  }
  const exhibits = caseData.exhibits.map(e => ({
    ...e,
    data: JSON.parse(e.data)
  }))
  const brandColor = caseData.brandColor || null

  const isDraft = caseData.status === 'draft'

  return (
    <article className="min-h-screen">
      {/* Print Cover Page - Hidden on screen, shown in print */}
      <div className="print-cover hidden print:flex">
        <div className="print-cover-brand">A Case A Day</div>
        <h1 className="print-cover-title">{caseData.title}</h1>
        <div className="print-cover-company">{caseData.company}</div>
        <div className="print-cover-industry">{caseData.industry}</div>
        <div className="print-cover-divider" />
        <div className="print-cover-meta">
          Published {formatDate(caseData.publishedAt!)}
        </div>
        {caseData.concepts.length > 0 && (
          <div className="print-cover-concepts">
            <div className="print-cover-concepts-title">MBA Concepts Covered</div>
            <div className="print-cover-concepts-list">
              {caseData.concepts.map(({ concept }) => (
                <span key={concept.id} className="print-cover-concept">
                  {concept.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Print Header - Shown after cover page in print */}
      <div className="print-header hidden print:block">
        <h2 className="print-header-title">{caseData.title}</h2>
        <div className="print-header-meta">
          {caseData.company} • {caseData.industry} • {formatDate(caseData.publishedAt!)}
        </div>
      </div>

      {/* Draft Banner */}
      {isDraft && (
        <div className="bg-amber-500 text-amber-950 py-3 px-4 print:hidden">
          <div className="mx-auto max-w-4xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">📝 DRAFT</span>
              <span className="text-amber-800">This case is not yet published and is only visible to operators.</span>
            </div>
            <a 
              href={`/operator/cases/${caseData.id}/edit`}
              className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              Edit & Publish
            </a>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <header className="relative bg-gradient-to-b from-slate-900 to-slate-800 text-white print:hidden overflow-hidden">
        {/* Featured Illustration Background */}
        {caseData.featuredImage && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40"
              style={{ backgroundImage: `url(${caseData.featuredImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/60" />
          </>
        )}
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <Link
            href="/cases"
            className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cases
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge variant="primary">{caseData.industry}</Badge>
            {caseData.concepts.slice(0, 3).map(({ concept }) => (
              <Link key={concept.id} href={`/concepts/${concept.slug}`}>
                <Badge variant={getConceptBadgeVariant(concept.category)} className="hover:ring-2 hover:ring-white/30 transition-all cursor-pointer">
                  {concept.name}
                </Badge>
              </Link>
            ))}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
            {caseData.title}
          </h1>

          <p className="text-xl text-slate-300 leading-relaxed mb-8 max-w-3xl">
            {caseData.summary}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {caseData.company}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(caseData.publishedAt!)}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Action Bar */}
        <CaseActions title={caseData.title} summary={caseData.summary} />

        {/* Case Narrative */}
        <div className="prose-case">
          {sections.map((section, index) => {
            // Format section titles: convert lowercase keys to proper display titles
            const sectionTitleMap: Record<string, string> = {
              'opening': 'Opening',
              'situation': 'The Situation',
              'stakes': 'The Stakes',
              'decision': 'The Decision Point',
            }
            const displayTitle = sectionTitleMap[section.title?.toLowerCase()] || section.title
            
            return (
            <section key={index} className="mb-12">
              {/* Section Header - styled differently for first section vs others */}
              {displayTitle && (
                index === 0 ? (
                  // First section gets a subtle opener style
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                        {displayTitle}
                      </span>
                      <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
                    </div>
                  </div>
                ) : (
                  // Subsequent sections get prominent headers
                  <div className="mb-6 mt-16 first:mt-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-1 h-6 rounded-full translate-y-4"
                        style={{ backgroundColor: brandColor || '#f59e0b' }}
                      />
                      <h2 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                        {displayTitle}
                      </h2>
                    </div>
                  </div>
                )
              )}
              
              {/* Section Content with markdown parsing */}
              <div className="space-y-4">
                {section.content.split('\n\n').map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-slate-700 leading-relaxed text-[17px]">
                    {parseMarkdown(paragraph)}
                  </p>
                ))}
              </div>

              {/* Insert exhibits after relevant sections */}
              {index === 0 && exhibits.length > 0 && (
                <div className="my-10">
                  <ExhibitRenderer exhibit={exhibits[0]} index={1} brandColor={brandColor} companyName={caseData.company} />
                </div>
              )}
              {index === 1 && exhibits.length > 1 && (
                <div className="my-10">
                  <ExhibitRenderer exhibit={exhibits[1]} index={2} brandColor={brandColor} companyName={caseData.company} />
                </div>
              )}
            </section>
          )})}
        </div>

        {/* Remaining Exhibits */}
        {exhibits.length > 2 && (
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-6">
              Additional Exhibits
            </h2>
            <div className="space-y-8">
              {exhibits.slice(2).map((exhibit, index) => (
                <ExhibitRenderer key={exhibit.id} exhibit={exhibit} index={index + 3} brandColor={brandColor} companyName={caseData.company} />
              ))}
            </div>
          </section>
        )}

        {/* Questions */}
        <section className="mt-16 pt-12 border-t border-slate-200 questions-section">
          <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-2 questions-section-title">
            Discussion Questions
          </h2>
          <p className="text-slate-600 mb-8 questions-section-intro print:hidden">
            Test your understanding with these interactive questions. 
            Submit your answers for instant feedback and scoring.
          </p>
          <p className="text-slate-600 mb-8 questions-section-intro hidden print:block">
            Consider the following questions as you analyze this case.
          </p>
          <QuestionList questions={caseData.questions} caseId={caseData.id} />
        </section>

        {/* Concepts Footer */}
        <section className="mt-16 pt-8 border-t border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
            MBA Concepts Covered
          </h3>
          <p className="text-slate-600 text-sm mb-4">
            Click a concept to learn more about the framework and see related cases.
          </p>
          <div className="flex flex-wrap gap-2">
            {caseData.concepts.map(({ concept }) => (
              <Link
                key={concept.id}
                href={`/concepts/${concept.slug}`}
                className="group"
              >
                <Badge
                  variant={getConceptBadgeVariant(concept.category)}
                  className="cursor-pointer hover:ring-2 hover:ring-amber-300 transition-all"
                >
                  {concept.name}
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </article>
  )
}
