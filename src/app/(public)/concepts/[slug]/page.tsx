import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { Badge } from '@/components/ui'
import { ArrowLeft, BookOpen, GraduationCap, LinkIcon, Lightbulb, Target, Building2, CheckCircle2, Zap } from 'lucide-react'
import { DiagramRenderer } from '@/components/concept/diagrams'
import { ExerciseRenderer } from '@/components/concept/exercises'
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const concept = await prisma.concept.findUnique({
    where: { slug },
    select: { name: true, description: true, category: true }
  })

  if (!concept) return { title: 'Concept Not Found' }

  return {
    title: `${concept.name} | A Case A Day`,
    description: concept.description || `Learn about ${concept.name} - a key ${concept.category} concept for MBA students.`
  }
}

// Muted editorial category colors for subtle accents
const categoryColors: Record<string, { accent: string; text: string }> = {
  Strategy: { accent: '#57534e', text: 'text-stone-600' },
  Finance: { accent: '#475569', text: 'text-slate-600' },
  Marketing: { accent: '#9f7aea', text: 'text-purple-600' },
  Operations: { accent: '#b45309', text: 'text-amber-700' },
  Leadership: { accent: '#047857', text: 'text-emerald-700' },
  Economics: { accent: '#4f46e5', text: 'text-indigo-600' }
}

const difficultyConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  beginner: { label: 'Beginner', color: 'text-slate-600', bgColor: 'bg-slate-100' },
  intermediate: { label: 'Intermediate', color: 'text-slate-700', bgColor: 'bg-slate-200' },
  advanced: { label: 'Advanced', color: 'text-slate-800', bgColor: 'bg-slate-300' }
}

export default async function ConceptPage({ params }: PageProps) {
  const { slug } = await params

  const concept = await prisma.concept.findUnique({
    where: { slug },
    include: {
      cases: {
        include: {
          case: {
            select: {
              id: true,
              slug: true,
              title: true,
              company: true,
              summary: true,
              industry: true,
              status: true
            }
          }
        }
      }
    }
  })

  if (!concept) {
    notFound()
  }

  const content = concept.content ? JSON.parse(concept.content) : null
  const diagramData = concept.diagramData ? JSON.parse(concept.diagramData) : null
  const exercises = concept.exercises ? JSON.parse(concept.exercises) : []
  
  // Get related concepts
  const relatedSlugs = concept.relatedIds?.split(',').map(s => s.trim()).filter(Boolean) || []
  const relatedConcepts = relatedSlugs.length > 0 
    ? await prisma.concept.findMany({
        where: { slug: { in: relatedSlugs } },
        select: { slug: true, name: true, category: true }
      })
    : []

  const colors = categoryColors[concept.category] || categoryColors.Strategy
  const difficultyInfo = difficultyConfig[concept.difficulty] || difficultyConfig.intermediate
  
  // Filter to published cases
  const publishedCases = concept.cases.filter(c => c.case.status === 'published')

  return (
    <article className="min-h-screen">
      {/* Hero Header - matches case page style */}
      <header className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <Link
            href="/concepts"
            className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Concepts
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="primary">{concept.category}</Badge>
            <Badge className={`${difficultyInfo.bgColor} ${difficultyInfo.color} border-transparent`}>
              <GraduationCap className="h-3 w-3 mr-1" />
              {difficultyInfo.label}
            </Badge>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
            {concept.name}
          </h1>

          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl">
            {concept.description}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Definition Section */}
        {content?.definition && (
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-1 h-8 rounded-full"
                style={{ backgroundColor: colors.accent }}
              />
              <h2 className="font-serif text-2xl font-bold text-slate-900">Definition</h2>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <p className="text-slate-700 leading-relaxed text-lg">
                {content.definition}
              </p>
            </div>
          </section>
        )}

        {/* Visual Framework Section */}
        {concept.diagramType && diagramData && (
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-1 h-8 rounded-full"
                style={{ backgroundColor: colors.accent }}
              />
              <h2 className="font-serif text-2xl font-bold text-slate-900">Visual Framework</h2>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <DiagramRenderer type={concept.diagramType} data={diagramData} category={concept.category} />
            </div>
          </section>
        )}

        {/* Key Principles Section */}
        {content?.principles && content.principles.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-1 h-8 rounded-full"
                style={{ backgroundColor: colors.accent }}
              />
              <h2 className="font-serif text-2xl font-bold text-slate-900">Key Principles</h2>
            </div>
            <div className="space-y-4">
              {content.principles.map((principle: { title: string; description: string }, index: number) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: colors.accent }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">{principle.title}</h3>
                      <p className="text-slate-600">{principle.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* When to Use Section */}
        {content?.whenToUse && content.whenToUse.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-1 h-8 rounded-full"
                style={{ backgroundColor: colors.accent }}
              />
              <h2 className="font-serif text-2xl font-bold text-slate-900">When to Use</h2>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <ul className="space-y-3">
                {content.whenToUse.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Real-World Examples Section */}
        {content?.examples && content.examples.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-1 h-8 rounded-full"
                style={{ backgroundColor: colors.accent }}
              />
              <h2 className="font-serif text-2xl font-bold text-slate-900">Real-World Examples</h2>
            </div>
            <div className="grid gap-4">
              {content.examples.map((example: { company: string; description: string }, index: number) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-semibold text-slate-900 text-lg mb-2">{example.company}</h3>
                  <p className="text-slate-600">{example.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interactive Exercises Section */}
        {exercises.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-1 h-8 rounded-full bg-amber-500" />
              <h2 className="font-serif text-2xl font-bold text-slate-900">Practice Exercises</h2>
            </div>
            <div className="space-y-6">
              {exercises.map((exercise: unknown, index: number) => (
                <ExerciseRenderer key={index} exercise={exercise} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Related Cases Section */}
        {publishedCases.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-1 h-8 rounded-full"
                style={{ backgroundColor: colors.accent }}
              />
              <h2 className="font-serif text-2xl font-bold text-slate-900">Related Cases</h2>
            </div>
            <div className="grid gap-4">
              {publishedCases.map(({ case: caseItem }) => (
                <Link
                  key={caseItem.id}
                  href={`/cases/${caseItem.slug}`}
                  className="group bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-amber-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-2">{caseItem.industry}</Badge>
                      <h3 className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                        {caseItem.title}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">{caseItem.company}</p>
                    </div>
                    <ArrowLeft className="h-5 w-5 text-slate-300 group-hover:text-amber-500 rotate-180 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Concepts Section */}
        {relatedConcepts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-1 h-8 rounded-full"
                style={{ backgroundColor: colors.accent }}
              />
              <h2 className="font-serif text-2xl font-bold text-slate-900">Related Concepts</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {relatedConcepts.map((related) => {
                const relatedColors = categoryColors[related.category] || categoryColors.Strategy
                return (
                  <Link
                    key={related.slug}
                    href={`/concepts/${related.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 hover:border-amber-300 hover:shadow-sm transition-all group"
                  >
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: relatedColors.accent }}
                    />
                    <span className="text-slate-700 group-hover:text-amber-600 transition-colors">
                      {related.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Back to Library */}
        <div className="pt-8 border-t border-slate-200">
          <Link
            href="/concepts"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Concept Library
          </Link>
        </div>
      </div>
    </article>
  )
}
