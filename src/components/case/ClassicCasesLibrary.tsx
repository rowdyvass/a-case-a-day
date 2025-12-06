'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, Badge, Button, Input } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { 
  Clock, 
  Building2, 
  Search, 
  Filter, 
  X, 
  Library,
  GraduationCap,
  Target,
  BarChart3
} from 'lucide-react'

interface Concept {
  id: string
  name: string
}

interface CanonicalCase {
  id: string
  slug: string
  title: string
  company: string
  industry: string
  summary: string
  publishedAt: Date | null
  track: string | null
  skill: string | null
  difficulty: string
  featuredImage: string | null
  concepts: { concept: Concept }[]
}

interface ClassicCasesLibraryProps {
  cases: CanonicalCase[]
  industries: string[]
  concepts: string[]
  tracks: string[]
  skills: string[]
  currentFilters: {
    industry?: string
    concept?: string
    track?: string
    skill?: string
    difficulty?: string
    search?: string
  }
}

const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-amber-100 text-amber-700' },
  { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-700' },
]

export function ClassicCasesLibrary({
  cases,
  industries,
  concepts,
  tracks,
  skills,
  currentFilters,
}: ClassicCasesLibraryProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(currentFilters.search || '')
  const [showFilters, setShowFilters] = useState(false)

  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    startTransition(() => {
      router.push(`/cases?${params.toString()}`)
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams('search', search || null)
  }

  const clearFilters = () => {
    setSearch('')
    startTransition(() => {
      router.push('/cases')
    })
  }

  const hasActiveFilters = currentFilters.industry || currentFilters.concept || 
    currentFilters.track || currentFilters.skill || currentFilters.difficulty || currentFilters.search

  const getDifficultyStyle = (difficulty: string) => {
    const option = DIFFICULTY_OPTIONS.find(d => d.value === difficulty)
    return option?.color || 'bg-slate-100 text-slate-700'
  }

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Library className="h-5 w-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Classic Cases Library
          </h2>
          <p className="text-slate-600">
            Comprehensive case studies for deep learning
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search classic cases by title, company, or topic..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-300 bg-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
            />
          </div>
          <Button type="submit" variant="primary" isLoading={isPending} className="bg-indigo-600 hover:bg-indigo-700">
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </form>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="p-5 bg-white rounded-xl border border-slate-200 mb-4 space-y-5">
            {/* Track Filter */}
            {tracks.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-indigo-500" />
                  Track
                </p>
                <div className="flex flex-wrap gap-2">
                  {tracks.map((track) => (
                    <button
                      key={track}
                      onClick={() => updateParams('track', track === currentFilters.track ? null : track)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        track === currentFilters.track
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {track}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty Filter */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                Difficulty
              </p>
              <div className="flex flex-wrap gap-2">
                {DIFFICULTY_OPTIONS.map((diff) => (
                  <button
                    key={diff.value}
                    onClick={() => updateParams('difficulty', diff.value === currentFilters.difficulty ? null : diff.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      diff.value === currentFilters.difficulty
                        ? 'bg-indigo-500 text-white'
                        : `${diff.color} hover:opacity-80`
                    }`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Industry Filter */}
            {industries.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Industry</p>
                <div className="flex flex-wrap gap-2">
                  {industries.map((industry) => (
                    <button
                      key={industry}
                      onClick={() => updateParams('industry', industry === currentFilters.industry ? null : industry)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        industry === currentFilters.industry
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Concept Filter */}
            {concepts.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-500" />
                  MBA Concept
                </p>
                <div className="flex flex-wrap gap-2">
                  {concepts.map((concept) => (
                    <button
                      key={concept}
                      onClick={() => updateParams('concept', concept === currentFilters.concept ? null : concept)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        concept === currentFilters.concept
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {concept}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Filter */}
            {skills.length > 0 && (
              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => updateParams('skill', skill === currentFilters.skill ? null : skill)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        skill === currentFilters.skill
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-500">Active filters:</span>
            {currentFilters.track && (
              <FilterPill label={currentFilters.track} onRemove={() => updateParams('track', null)} />
            )}
            {currentFilters.difficulty && (
              <FilterPill 
                label={DIFFICULTY_OPTIONS.find(d => d.value === currentFilters.difficulty)?.label || currentFilters.difficulty} 
                onRemove={() => updateParams('difficulty', null)} 
              />
            )}
            {currentFilters.industry && (
              <FilterPill label={currentFilters.industry} onRemove={() => updateParams('industry', null)} />
            )}
            {currentFilters.concept && (
              <FilterPill label={currentFilters.concept} onRemove={() => updateParams('concept', null)} />
            )}
            {currentFilters.skill && (
              <FilterPill label={currentFilters.skill} onRemove={() => updateParams('skill', null)} />
            )}
            {currentFilters.search && (
              <FilterPill label={`"${currentFilters.search}"`} onRemove={() => { setSearch(''); updateParams('search', null) }} />
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-700 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {cases.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-xl">
          <Library className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-semibold text-slate-700 mb-2">
            No classic cases found
          </h3>
          <p className="text-slate-500 mb-4">
            {hasActiveFilters 
              ? 'Try adjusting your filters or search terms.'
              : 'Classic cases will appear here once they are created.'}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem, index) => (
            <Link
              key={caseItem.id}
              href={`/cases/${caseItem.slug}`}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Card className="h-full flex flex-col group hover:border-indigo-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
                {/* Featured Image - taller for better visibility */}
                {caseItem.featuredImage ? (
                  <div 
                    className="h-40 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${caseItem.featuredImage})` }}
                  >
                    {/* Track + Difficulty overlay on image */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      {caseItem.track && (
                        <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-indigo-700 shadow-sm">
                          {caseItem.track}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm shadow-sm ${
                        caseItem.difficulty === 'beginner' ? 'text-emerald-700' :
                        caseItem.difficulty === 'advanced' ? 'text-red-700' : 'text-amber-700'
                      }`}>
                        {caseItem.difficulty.charAt(0).toUpperCase() + caseItem.difficulty.slice(1)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-20 bg-gradient-to-br from-indigo-50 to-slate-50 relative">
                    {/* Track + Difficulty when no image */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      {caseItem.track && (
                        <span className="px-2 py-0.5 bg-indigo-100 rounded-full text-xs font-medium text-indigo-700">
                          {caseItem.track}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyStyle(caseItem.difficulty)}`}>
                        {caseItem.difficulty.charAt(0).toUpperCase() + caseItem.difficulty.slice(1)}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="p-5 flex-1 flex flex-col">
                  {/* Industry */}
                  <span className="inline-block px-2 py-0.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600 mb-2 w-fit">
                    {caseItem.industry}
                  </span>

                  {/* Title */}
                  <h3 className="font-serif text-lg font-semibold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {caseItem.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1">
                    {caseItem.summary}
                  </p>

                  {/* Concepts */}
                  <div className="flex flex-wrap gap-1">
                    {caseItem.concepts.slice(0, 3).map(({ concept }) => (
                      <span
                        key={concept.id}
                        className="px-2 py-0.5 bg-indigo-50 rounded-full text-xs text-indigo-600"
                      >
                        {concept.name}
                      </span>
                    ))}
                    {caseItem.concepts.length > 3 && (
                      <span className="px-2 py-0.5 text-xs text-slate-400">
                        +{caseItem.concepts.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    {caseItem.company}
                  </span>
                  {caseItem.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(caseItem.publishedAt)}
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
      {label}
      <button onClick={onRemove} className="hover:text-indigo-900">
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}

