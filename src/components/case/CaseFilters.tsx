'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Input, Button } from '@/components/ui'
import { Search, X, Filter } from 'lucide-react'

interface CaseFiltersProps {
  industries: string[]
  concepts: string[]
  currentIndustry?: string
  currentConcept?: string
  currentSearch?: string
}

export function CaseFilters({
  industries,
  concepts,
  currentIndustry,
  currentConcept,
  currentSearch
}: CaseFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(currentSearch || '')
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

  const hasActiveFilters = currentIndustry || currentConcept || currentSearch

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cases by title, company, or topic..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-300 bg-white text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-colors"
          />
        </div>
        <Button type="submit" variant="primary" isLoading={isPending}>
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

      {/* Filter Pills */}
      {showFilters && (
        <div className="p-4 bg-white rounded-xl border border-slate-200 mb-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Industry</p>
              <div className="flex flex-wrap gap-2">
                {industries.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => updateParams('industry', industry === currentIndustry ? null : industry)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      industry === currentIndustry
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Concept</p>
              <div className="flex flex-wrap gap-2">
                {concepts.map((concept) => (
                  <button
                    key={concept}
                    onClick={() => updateParams('concept', concept === currentConcept ? null : concept)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      concept === currentConcept
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {concept}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-slate-500">Active filters:</span>
          {currentIndustry && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
              {currentIndustry}
              <button onClick={() => updateParams('industry', null)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {currentConcept && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
              {currentConcept}
              <button onClick={() => updateParams('concept', null)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {currentSearch && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
              &quot;{currentSearch}&quot;
              <button onClick={() => { setSearch(''); updateParams('search', null) }}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-sm text-amber-600 hover:text-amber-700 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}


