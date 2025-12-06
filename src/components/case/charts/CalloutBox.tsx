'use client'

import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * CalloutBox
 * 
 * Editorial-quality callout/highlight box with:
 * - Multiple variants
 * - Icon support
 * - Brand-derived colors
 */

interface CalloutData {
  content: string
  title?: string
  variant?: 'info' | 'warning' | 'success' | 'highlight' | 'quote'
  icon?: string
  attribution?: string
}

interface CalloutBoxProps {
  data: CalloutData
}

export function CalloutBox({ data }: CalloutBoxProps) {
  const palette = useExhibitPalette()

  const getVariantStyles = () => {
    switch (data.variant) {
      case 'warning':
        return {
          bg: palette.neutralLight,
          border: palette.neutral,
          icon: '⚠️',
          iconBg: palette.neutral
        }
      case 'success':
        return {
          bg: palette.positiveLight,
          border: palette.positive,
          icon: '✓',
          iconBg: palette.positive
        }
      case 'highlight':
        return {
          bg: palette.primaryLight,
          border: palette.primary,
          icon: '★',
          iconBg: palette.primary
        }
      case 'quote':
        return {
          bg: palette.backgroundAlt,
          border: palette.primary,
          icon: '"',
          iconBg: palette.primary
        }
      default:
        return {
          bg: palette.primaryLight,
          border: palette.primary,
          icon: 'i',
          iconBg: palette.primary
        }
    }
  }

  const styles = getVariantStyles()
  const isQuote = data.variant === 'quote'

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl p-5 border-l-4"
      style={{
        backgroundColor: styles.bg,
        borderLeftColor: styles.border
      }}
    >
      <div className="flex gap-4">
        {/* Icon */}
        {!isQuote && (
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
            style={{ backgroundColor: styles.iconBg }}
          >
            {data.icon || styles.icon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          {data.title && !isQuote && (
            <h4 
              className="font-semibold mb-2"
              style={{ color: styles.border }}
            >
              {data.title}
            </h4>
          )}
          
          {isQuote ? (
            <blockquote>
              <p className="font-serif text-lg italic text-slate-700 leading-relaxed">
                &ldquo;{data.content}&rdquo;
              </p>
              {data.attribution && (
                <footer className="mt-3 text-sm text-slate-500">
                  — {data.attribution}
                </footer>
              )}
            </blockquote>
          ) : (
            <p className="text-sm text-slate-700 leading-relaxed">
              {data.content}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
