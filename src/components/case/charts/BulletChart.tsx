'use client'

import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * BulletChart
 * 
 * Editorial-quality bullet chart for showing performance against targets.
 */

interface BulletData {
  items: {
    label: string
    value: number
    target: number
    ranges?: [number, number, number] // Poor, Satisfactory, Good thresholds
    unit?: string
  }[]
}

interface BulletChartProps {
  data: BulletData
}

export function BulletChart({ data }: BulletChartProps) {
  const palette = useExhibitPalette()

  // Defensive check for missing or malformed data
  if (!data?.items || !Array.isArray(data.items) || data.items.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No bullet chart data available</p>
      </div>
    )
  }

  const formatValue = (value: number, unit?: string) => {
    if (unit === '$B') return `$${value.toFixed(1)}B`
    if (unit === '$M') return `$${value.toFixed(0)}M`
    if (unit === '%') return `${value.toFixed(1)}%`
    return value.toLocaleString()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {data.items.map((item, index) => {
        const maxValue = Math.max(item.value, item.target, ...(item.ranges || []))
        const valuePercent = (item.value / maxValue) * 100
        const targetPercent = (item.target / maxValue) * 100
        const ranges = item.ranges || [maxValue * 0.33, maxValue * 0.66, maxValue]

        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-2"
          >
            {/* Label and value */}
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
              <div className="text-sm">
                <span className="font-semibold text-slate-900">
                  {formatValue(item.value, item.unit)}
                </span>
                <span className="text-slate-400 mx-1">/</span>
                <span className="text-slate-500">
                  {formatValue(item.target, item.unit)}
                </span>
              </div>
            </div>

            {/* Bullet chart */}
            <div className="relative h-8 rounded overflow-hidden">
              {/* Background ranges */}
              <div className="absolute inset-0 flex">
                <div 
                  className="h-full"
                  style={{ 
                    width: `${(ranges[0] / maxValue) * 100}%`,
                    backgroundColor: palette.negativeLight
                  }}
                />
                <div 
                  className="h-full"
                  style={{ 
                    width: `${((ranges[1] - ranges[0]) / maxValue) * 100}%`,
                    backgroundColor: palette.neutralLight
                  }}
                />
                <div 
                  className="h-full"
                  style={{ 
                    width: `${((ranges[2] - ranges[1]) / maxValue) * 100}%`,
                    backgroundColor: palette.positiveLight
                  }}
                />
              </div>

              {/* Value bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${valuePercent}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="absolute top-2 h-4 rounded"
                style={{ backgroundColor: palette.primary }}
              />

              {/* Target marker */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="absolute top-0 bottom-0 w-0.5"
                style={{ 
                  left: `${targetPercent}%`,
                  backgroundColor: palette.text
                }}
              />
            </div>
          </motion.div>
        )
      })}

      {/* Legend */}
      <div className="chart-legend chart-legend-horizontal mt-4">
        <div className="chart-legend-item">
          <span className="w-4 h-3 rounded" style={{ backgroundColor: palette.primary }} />
          <span className="chart-legend-label">Actual</span>
        </div>
        <div className="chart-legend-item">
          <span className="w-0.5 h-4 rounded" style={{ backgroundColor: palette.text }} />
          <span className="chart-legend-label">Target</span>
        </div>
      </div>
    </motion.div>
  )
}
