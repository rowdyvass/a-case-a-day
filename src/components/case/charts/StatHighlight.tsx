'use client'

import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * StatHighlight
 * 
 * Editorial-quality statistic highlight with:
 * - Large display number
 * - Context and comparison
 * - Brand-derived styling
 */

interface StatHighlightData {
  value: string | number
  label: string
  description?: string
  comparison?: {
    value: string | number
    label: string
    direction?: 'up' | 'down' | 'neutral'
  }
  unit?: string
  variant?: 'default' | 'large' | 'compact'
}

interface StatHighlightProps {
  data: StatHighlightData
}

export function StatHighlight({ data }: StatHighlightProps) {
  const palette = useExhibitPalette()

  // Early return if no data
  if (!data || data.value === undefined || data.value === null) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-400">
        <span>No data available</span>
      </div>
    )
  }

  const formatValue = (value: string | number | undefined | null) => {
    if (value === undefined || value === null) return '—'
    if (typeof value === 'string') return value
    if (data.unit === '$B') return `$${value.toFixed(1)}B`
    if (data.unit === '$M') return `$${value.toFixed(0)}M`
    if (data.unit === '%') return `${value.toFixed(1)}%`
    return value.toLocaleString()
  }

  const getDirectionStyles = () => {
    switch (data.comparison?.direction) {
      case 'up':
        return { color: palette.positive, icon: '↑' }
      case 'down':
        return { color: palette.negative, icon: '↓' }
      default:
        return { color: palette.textMuted, icon: '→' }
    }
  }

  const sizeStyles = {
    default: { value: 'text-4xl', label: 'text-sm' },
    large: { value: 'text-6xl', label: 'text-base' },
    compact: { value: 'text-2xl', label: 'text-xs' }
  }

  const size = sizeStyles[data.variant || 'default']
  const direction = getDirectionStyles()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center py-6"
    >
      {/* Main value */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className={`font-serif ${size.value} font-bold`}
        style={{ color: palette.primary }}
      >
        {formatValue(data.value)}
      </motion.div>

      {/* Label */}
      <div className={`${size.label} font-medium text-slate-600 mt-2`}>
        {data.label}
      </div>

      {/* Description */}
      {data.description && (
        <p className="text-sm text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
          {data.description}
        </p>
      )}

      {/* Comparison */}
      {data.comparison && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ backgroundColor: palette.backgroundAlt }}
        >
          <span style={{ color: direction.color }}>{direction.icon}</span>
          <span className="text-sm">
            <span className="font-medium" style={{ color: direction.color }}>
              {formatValue(data.comparison.value)}
            </span>
            <span className="text-slate-500 ml-1">{data.comparison.label}</span>
          </span>
        </motion.div>
      )}
    </motion.div>
  )
}
