'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useState, useTransition } from 'react'

interface ConceptFiltersProps {
  categories: string[]
  difficulties: string[]
  currentCategory?: string
  currentDifficulty?: string
  currentSearch?: string
}

// Muted editorial category accents
const categoryAccents: Record<string, string> = {
  Strategy: '#57534e',
  Finance: '#475569',
  Marketing: '#9f7aea',
  Operations: '#b45309',
  Leadership: '#047857',
  Economics: '#4f46e5'
}

export function ConceptFilters({
  categories,
  difficulties,
  currentCategory,
  currentDifficulty,
  currentSearch
}: ConceptFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(currentSearch || '')

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    startTransition(() => {
      router.push(`/concepts?${params.toString()}`)
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('search', searchValue || null)
  }

  const clearFilters = () => {
    setSearchValue('')
    startTransition(() => {
      router.push('/concepts')
    })
  }

  const hasFilters = currentCategory || currentDifficulty || currentSearch

  return (
    <div className="mb-10 space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search concepts..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => {
              setSearchValue('')
              updateFilter('search', null)
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => updateFilter('category', null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !currentCategory
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => {
          const isActive = currentCategory === category
          const accentColor = categoryAccents[category] || '#64748b'
          
          return (
            <button
              key={category}
              onClick={() => updateFilter('category', isActive ? null : category)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-slate-100 text-slate-800 border-slate-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              {category}
            </button>
          )
        })}
      </div>

      {/* Difficulty Filter */}
      <div className="flex items-center justify-center gap-4">
        <span className="text-sm text-slate-500 flex items-center gap-1.5">
          <SlidersHorizontal className="h-4 w-4" />
          Difficulty:
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => updateFilter('difficulty', null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              !currentDifficulty
                ? 'bg-slate-200 text-slate-800'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            All
          </button>
          {difficulties.map((difficulty) => {
            const isActive = currentDifficulty === difficulty
            return (
              <button
                key={difficulty}
                onClick={() => updateFilter('difficulty', isActive ? null : difficulty)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                  isActive
                    ? 'bg-slate-200 text-slate-800'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {difficulty}
              </button>
            )
          })}
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <div className="flex justify-center">
          <button
            onClick={clearFilters}
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
          >
            <X className="h-3.5 w-3.5" />
            Clear all filters
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {isPending && (
        <div className="flex justify-center">
          <div className="h-1 w-24 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 animate-shimmer" />
          </div>
        </div>
      )}
    </div>
  )
}
