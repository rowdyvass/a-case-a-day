'use client'

import Link from 'next/link'
import { BookOpen, ChevronRight, GraduationCap } from 'lucide-react'

interface ConceptCardProps {
  slug: string
  name: string
  category: string
  description: string
  difficulty: string
  caseCount: number
  index?: number
}

// Muted, editorial category colors with CSS variable references
const categoryColors: Record<string, { accent: string; text: string }> = {
  Strategy: { accent: '#57534e', text: 'text-stone-600' },
  Finance: { accent: '#475569', text: 'text-slate-600' },
  Marketing: { accent: '#9f7aea', text: 'text-purple-600' },
  Operations: { accent: '#b45309', text: 'text-amber-700' },
  Leadership: { accent: '#047857', text: 'text-emerald-700' },
  Economics: { accent: '#4f46e5', text: 'text-indigo-600' }
}

const difficultyConfig: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'text-slate-500' },
  intermediate: { label: 'Intermediate', color: 'text-slate-600' },
  advanced: { label: 'Advanced', color: 'text-slate-700' }
}

export function ConceptCard({ slug, name, category, description, difficulty, caseCount, index = 0 }: ConceptCardProps) {
  const colors = categoryColors[category] || categoryColors.Strategy
  const difficultyInfo = difficultyConfig[difficulty] || difficultyConfig.intermediate

  return (
    <Link
      href={`/concepts/${slug}`}
      className="group animate-fade-in-up"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div 
        className="h-full bg-white rounded-xl border border-slate-200 p-5 transition-all duration-200 hover:shadow-md hover:border-amber-300"
        style={{ borderLeftWidth: '3px', borderLeftColor: colors.accent }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: colors.accent }}
            />
            <span className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}>
              {category}
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg font-semibold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <GraduationCap className={`h-3.5 w-3.5 ${difficultyInfo.color}`} />
            <span className={`text-xs font-medium ${difficultyInfo.color}`}>
              {difficultyInfo.label}
            </span>
          </div>
          {caseCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <BookOpen className="h-3 w-3" />
              <span>{caseCount} case{caseCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
