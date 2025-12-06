'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * DumbbellChart
 * 
 * Editorial-quality dumbbell chart for before/after or comparison visualization.
 */

interface DumbbellData {
  items: {
    name: string
    start: number
    end: number
    startLabel?: string
    endLabel?: string
  }[]
  startLabel?: string
  endLabel?: string
  unit?: string
}

interface DumbbellChartProps {
  data: DumbbellData
}

export function DumbbellChart({ data }: DumbbellChartProps) {
  const palette = useExhibitPalette()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Defensive check for missing or malformed data
  if (!data?.items || !Array.isArray(data.items) || data.items.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No dumbbell chart data available</p>
      </div>
    )
  }

  const allValues = data.items.flatMap(item => [item.start, item.end])
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  const range = maxValue - minValue

  const getPosition = (value: number) => {
    return ((value - minValue) / range) * 100
  }

  const formatValue = (value: number) => {
    if (data.unit === '$B') return `$${value.toFixed(1)}B`
    if (data.unit === '$M') return `$${value.toFixed(0)}M`
    if (data.unit === '%') return `${value.toFixed(1)}%`
    return value.toLocaleString()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex justify-between px-28 text-xs font-medium">
        <span style={{ color: palette.primary }}>{data.startLabel || 'Start'}</span>
        <span style={{ color: palette.positive }}>{data.endLabel || 'End'}</span>
      </div>

      {/* Items */}
      <div className="space-y-4">
        {data.items.map((item, index) => {
          const startPos = getPosition(item.start)
          const endPos = getPosition(item.end)
          const isHovered = hoveredItem === item.name
          const isIncrease = item.end >= item.start

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Label */}
              <div className="w-24 flex-shrink-0 text-right">
                <span className="text-sm font-medium text-slate-700">{item.name}</span>
              </div>

              {/* Dumbbell */}
              <div className="flex-1 relative h-8">
                {/* Connecting line */}
                <motion.div
                  className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full"
                  style={{
                    left: `${Math.min(startPos, endPos)}%`,
                    width: `${Math.abs(endPos - startPos)}%`,
                    backgroundColor: isHovered ? (isIncrease ? palette.positive : palette.negative) : palette.border
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />

                {/* Start dot */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full z-10"
                  style={{
                    left: `${startPos}%`,
                    width: isHovered ? 14 : 10,
                    height: isHovered ? 14 : 10,
                    backgroundColor: palette.primary,
                    boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />

                {/* End dot */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full z-10"
                  style={{
                    left: `${endPos}%`,
                    width: isHovered ? 14 : 10,
                    height: isHovered ? 14 : 10,
                    backgroundColor: palette.positive,
                    boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />

                {/* Values on hover */}
                {isHovered && (
                  <>
                    <div 
                      className="absolute -top-5 -translate-x-1/2 text-xs font-medium whitespace-nowrap"
                      style={{ left: `${startPos}%`, color: palette.primary }}
                    >
                      {formatValue(item.start)}
                    </div>
                    <div 
                      className="absolute -top-5 -translate-x-1/2 text-xs font-medium whitespace-nowrap"
                      style={{ left: `${endPos}%`, color: palette.positive }}
                    >
                      {formatValue(item.end)}
                    </div>
                  </>
                )}
              </div>

              {/* Change indicator */}
              <div className="w-16 flex-shrink-0">
                <span 
                  className="text-xs font-medium"
                  style={{ color: isIncrease ? palette.positive : palette.negative }}
                >
                  {isIncrease ? '+' : ''}{((item.end - item.start) / item.start * 100).toFixed(0)}%
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Scale */}
      <div className="flex justify-between px-28 text-xs text-slate-400">
        <span>{formatValue(minValue)}</span>
        <span>{formatValue(maxValue)}</span>
      </div>

      {/* Legend */}
      <div className="chart-legend chart-legend-horizontal">
        <div className="chart-legend-item">
          <span className="chart-legend-dot" style={{ backgroundColor: palette.primary }} />
          <span className="chart-legend-label">{data.startLabel || 'Start'}</span>
        </div>
        <div className="chart-legend-item">
          <span className="chart-legend-dot" style={{ backgroundColor: palette.positive }} />
          <span className="chart-legend-label">{data.endLabel || 'End'}</span>
        </div>
      </div>
    </motion.div>
  )
}
