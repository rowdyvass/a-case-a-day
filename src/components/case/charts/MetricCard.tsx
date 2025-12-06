'use client'

import { LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * MetricCard
 * 
 * Editorial-quality metric card with:
 * - Sparkline visualization
 * - Change indicators
 * - Brand-derived colors
 */

interface MetricCardData {
  label: string
  value: number | string
  previousValue?: number
  change?: number
  changeType?: 'percent' | 'absolute'
  trend?: number[]
  trendType?: 'line' | 'area' | 'bar'
  unit?: string
  format?: 'currency' | 'percent' | 'number' | 'compact'
  icon?: string
  color?: 'blue' | 'green' | 'red' | 'amber' | 'purple' | 'brand'
  size?: 'sm' | 'md' | 'lg'
}

interface MetricCardProps {
  data: MetricCardData
}

export function MetricCard({ data }: MetricCardProps) {
  const palette = useExhibitPalette()

  const getColorStyles = () => {
    switch (data.color) {
      case 'green': return { bg: palette.positiveLight, accent: palette.positive }
      case 'red': return { bg: palette.negativeLight, accent: palette.negative }
      case 'amber': return { bg: palette.neutralLight, accent: palette.neutral }
      case 'purple': return { bg: '#f5f3ff', accent: '#8b5cf6' }
      case 'brand': return { bg: palette.primaryLight, accent: palette.primary }
      default: return { bg: palette.primaryLight, accent: palette.primary }
    }
  }

  const colors = getColorStyles()

  const formatValue = (value: number | string) => {
    if (typeof value === 'string') return value

    switch (data.format) {
      case 'currency':
        if (data.unit === '$B') return `$${value.toFixed(1)}B`
        if (data.unit === '$M') return `$${value.toFixed(0)}M`
        return `$${value.toLocaleString()}`
      case 'percent':
        return `${value.toFixed(1)}%`
      case 'compact':
        if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`
        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
        if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
        return value.toString()
      default:
        return value.toLocaleString()
    }
  }

  const trendData = data.trend?.map((value, i) => ({ value, index: i })) || []
  const isPositiveChange = (data.change || 0) >= 0

  const sizeStyles = {
    sm: { padding: 'p-4', valueSize: 'text-2xl', labelSize: 'text-xs' },
    md: { padding: 'p-5', valueSize: 'text-3xl', labelSize: 'text-sm' },
    lg: { padding: 'p-6', valueSize: 'text-4xl', labelSize: 'text-sm' }
  }

  const size = sizeStyles[data.size || 'md']

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.1)' }}
      className={`metric-card rounded-xl ${size.padding}`}
      style={{ backgroundColor: colors.bg }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <span className={`metric-label ${size.labelSize} font-medium text-slate-600`}>
          {data.label}
        </span>
        {data.icon && <span className="text-lg">{data.icon}</span>}
      </div>

      {/* Value */}
      <motion.div 
        className={`metric-value font-serif ${size.valueSize} font-bold text-slate-900 mb-1`}
        key={String(data.value)}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {formatValue(data.value)}
      </motion.div>

      {/* Change indicator */}
      {data.change !== undefined && (
        <div className={`metric-change flex items-center gap-1 text-sm ${
          isPositiveChange ? 'metric-change-positive' : 'metric-change-negative'
        }`}
          style={{ color: isPositiveChange ? palette.positive : palette.negative }}
        >
          <span>{isPositiveChange ? '↑' : '↓'}</span>
          <span className="font-medium">
            {data.changeType === 'percent' 
              ? `${Math.abs(data.change).toFixed(1)}%`
              : formatValue(Math.abs(data.change))
            }
          </span>
          {data.previousValue !== undefined && (
            <span className="text-slate-400 ml-1">
              vs {formatValue(data.previousValue)}
            </span>
          )}
        </div>
      )}

      {/* Sparkline */}
      {data.trend && data.trend.length > 0 && (
        <div className="metric-sparkline h-12 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            {data.trendType === 'area' ? (
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id={`sparkline-gradient-${data.label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.accent} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colors.accent} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={colors.accent}
                  fill={`url(#sparkline-gradient-${data.label})`}
                  strokeWidth={2}
                />
              </AreaChart>
            ) : (
              <LineChart data={trendData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={colors.accent}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  )
}

// Grid of multiple metric cards
interface MetricGridData {
  metrics: MetricCardData[]
  columns?: 2 | 3 | 4
}

interface MetricGridProps {
  data: MetricGridData
}

export function MetricGrid({ data }: MetricGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={`grid ${gridCols[data.columns || 3]} gap-4`}>
      {data.metrics.map((metric, i) => (
        <MetricCard key={i} data={metric} />
      ))}
    </div>
  )
}
