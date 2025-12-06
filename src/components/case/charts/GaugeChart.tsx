'use client'

import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * GaugeChart
 * 
 * Editorial-quality gauge/dial chart with:
 * - Configurable thresholds
 * - Animated needle/value
 * - Brand-derived colors
 */

interface GaugeData {
  value: number
  min?: number
  max?: number
  thresholds?: {
    low: number
    medium: number
    high: number
  }
  label?: string
  unit?: string
  format?: 'number' | 'percent' | 'currency'
}

interface GaugeChartProps {
  data: GaugeData
}

export function GaugeChart({ data }: GaugeChartProps) {
  const palette = useExhibitPalette()

  // Defensive check for missing or malformed data
  if (!data || typeof data.value !== 'number') {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No gauge chart data available</p>
      </div>
    )
  }
  
  const min = data.min ?? 0
  const max = data.max ?? 100
  const value = Math.min(Math.max(data.value, min), max)
  const percentage = ((value - min) / (max - min)) * 100

  const thresholds = data.thresholds ?? { low: 33, medium: 66, high: 100 }

  const getColor = () => {
    const normalizedValue = (value - min) / (max - min) * 100
    if (normalizedValue <= thresholds.low) return palette.negative
    if (normalizedValue <= thresholds.medium) return palette.neutral
    return palette.positive
  }

  const formatValue = (val: number) => {
    if (data.format === 'percent') return `${val.toFixed(1)}%`
    if (data.format === 'currency') return `$${val.toLocaleString()}`
    return val.toLocaleString()
  }

  // Gauge background segments
  const gaugeData = [
    { name: 'low', value: thresholds.low, color: palette.negativeLight },
    { name: 'medium', value: thresholds.medium - thresholds.low, color: palette.neutralLight },
    { name: 'high', value: 100 - thresholds.medium, color: palette.positiveLight },
  ]

  // Value indicator
  const valueAngle = -90 + (percentage * 1.8) // 180 degree arc

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={gaugeData}
            cx="50%"
            cy="85%"
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={110}
            dataKey="value"
            stroke="none"
          >
            {gaugeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {/* Value arc overlay */}
          <Pie
            data={[{ value: percentage }, { value: 100 - percentage }]}
            cx="50%"
            cy="85%"
            startAngle={180}
            endAngle={0}
            innerRadius={85}
            outerRadius={105}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={getColor()} />
            <Cell fill="transparent" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div 
            className="font-serif text-4xl font-bold"
            style={{ color: getColor() }}
          >
            {formatValue(value)}
          </div>
          {data.label && (
            <div className="text-sm text-slate-500 mt-1">{data.label}</div>
          )}
        </motion.div>
      </div>

      {/* Scale labels */}
      <div className="flex justify-between px-8 -mt-4">
        <span className="text-xs text-slate-400">{formatValue(min)}</span>
        <span className="text-xs text-slate-400">{formatValue(max)}</span>
      </div>

      {/* Threshold legend */}
      <div className="chart-legend chart-legend-horizontal mt-4">
        <div className="chart-legend-item">
          <span className="chart-legend-dot" style={{ backgroundColor: palette.negative }} />
          <span className="chart-legend-label">Low</span>
        </div>
        <div className="chart-legend-item">
          <span className="chart-legend-dot" style={{ backgroundColor: palette.neutral }} />
          <span className="chart-legend-label">Medium</span>
        </div>
        <div className="chart-legend-item">
          <span className="chart-legend-dot" style={{ backgroundColor: palette.positive }} />
          <span className="chart-legend-label">High</span>
        </div>
      </div>
    </motion.div>
  )
}
