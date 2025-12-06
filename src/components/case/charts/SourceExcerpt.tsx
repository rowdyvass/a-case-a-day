'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * SourceExcerpt
 * 
 * Editorial-quality source excerpt with:
 * - Expandable content
 * - Source attribution
 * - Highlighted key phrases
 */

interface SourceExcerptData {
  excerpt: string
  source: string
  date?: string
  url?: string
  highlights?: string[]
  isExpandable?: boolean
  fullText?: string
}

interface SourceExcerptProps {
  data: SourceExcerptData
}

export function SourceExcerpt({ data }: SourceExcerptProps) {
  const palette = useExhibitPalette()
  const [isExpanded, setIsExpanded] = useState(false)

  // Highlight matching phrases
  const getHighlightedText = (text: string) => {
    if (!data.highlights || data.highlights.length === 0) {
      return text
    }

    let result = text
    data.highlights.forEach(phrase => {
      const regex = new RegExp(`(${phrase})`, 'gi')
      result = result.replace(regex, `<mark style="background-color: ${palette.primaryLight}; padding: 0 2px;">$1</mark>`)
    })
    return result
  }

  const displayText = isExpanded && data.fullText ? data.fullText : data.excerpt

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: palette.border }}
    >
      {/* Header */}
      <div 
        className="px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: palette.backgroundAlt }}
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: palette.primary }}
          />
          <span className="text-sm font-medium text-slate-700">{data.source}</span>
        </div>
        {data.date && (
          <span className="text-xs text-slate-500">{data.date}</span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Web view - interactive */}
        <motion.div
          initial={false}
          animate={{ height: 'auto' }}
          className="relative print:hidden"
        >
          <p 
            className="text-sm text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: getHighlightedText(displayText) }}
          />
          
          {/* Fade overlay for truncated text */}
          {!isExpanded && data.isExpandable && data.fullText && (
            <div 
              className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
              style={{
                background: `linear-gradient(to bottom, transparent, white)`
              }}
            />
          )}
        </motion.div>

        {/* Print view - always show full text */}
        <div className="hidden print:block">
          <p 
            className="text-sm text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: getHighlightedText(data.fullText || data.excerpt) }}
          />
        </div>

        {/* Expand/collapse button - hidden in print */}
        {data.isExpandable && data.fullText && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-sm font-medium transition-colors print:hidden"
            style={{ color: palette.primary }}
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Footer with link */}
      {data.url && (
        <div 
          className="px-4 py-2 border-t"
          style={{ 
            backgroundColor: palette.backgroundAlt,
            borderTopColor: palette.border
          }}
        >
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs flex items-center gap-1 transition-colors"
            style={{ color: palette.primary }}
          >
            <span>View original source</span>
            <span>→</span>
          </a>
        </div>
      )}
    </motion.div>
  )
}
