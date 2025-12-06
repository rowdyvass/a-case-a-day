'use client'

import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * QuoteComparison
 * 
 * Editorial-quality quote comparison with:
 * - Side-by-side quotes
 * - Contrast highlighting
 * - Brand-derived styling
 */

interface Quote {
  text: string
  attribution: string
  role?: string
  sentiment?: 'positive' | 'negative' | 'neutral'
}

interface QuoteComparisonData {
  quotes: Quote[]
  title?: string
  layout?: 'side-by-side' | 'stacked'
}

interface QuoteComparisonProps {
  data: QuoteComparisonData
}

export function QuoteComparison({ data }: QuoteComparisonProps) {
  const palette = useExhibitPalette()

  const getSentimentStyles = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return { border: palette.positive, bg: palette.positiveLight }
      case 'negative':
        return { border: palette.negative, bg: palette.negativeLight }
      default:
        return { border: palette.primary, bg: palette.backgroundAlt }
    }
  }

  const isSideBySide = data.layout !== 'stacked' && data.quotes.length === 2

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {data.title && (
        <h4 className="font-serif text-lg font-semibold text-slate-900 text-center">
          {data.title}
        </h4>
      )}

      <div className={isSideBySide ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
        {data.quotes.map((quote, index) => {
          const styles = getSentimentStyles(quote.sentiment)

          return (
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, x: isSideBySide ? (index === 0 ? -12 : 12) : 0, y: isSideBySide ? 0 : 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="rounded-xl p-5 border-l-4"
              style={{
                backgroundColor: styles.bg,
                borderLeftColor: styles.border
              }}
            >
              <p className="font-serif text-base italic text-slate-700 leading-relaxed">
                &ldquo;{quote.text}&rdquo;
              </p>
              <footer className="mt-4">
                <div className="font-semibold text-slate-900 text-sm">
                  {quote.attribution}
                </div>
                {quote.role && (
                  <div className="text-xs text-slate-500 mt-0.5">
                    {quote.role}
                  </div>
                )}
              </footer>
            </motion.blockquote>
          )
        })}
      </div>
    </motion.div>
  )
}
