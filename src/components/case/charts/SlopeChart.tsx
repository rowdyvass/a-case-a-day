'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * SlopeChart
 * 
 * Editorial-quality slope chart for showing change between two time periods.
 * Common in Economist-style visualizations.
 */

interface SlopeData {
  items: {
    name: string
    start: number
    end: number
    color?: string
  }[]
  startLabel: string
  endLabel: string
  unit?: string
}

interface SlopeChartProps {
  data: SlopeData
}

export function SlopeChart({ data }: SlopeChartProps) {
  const palette = useExhibitPalette()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Defensive check for missing or malformed data
  if (!data?.items || !Array.isArray(data.items) || data.items.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No data available for slope chart</p>
      </div>
    )
  }

  const allValues = data.items.flatMap(item => [item.start, item.end])
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  const range = maxValue - minValue

  const getY = (value: number) => {
    return 100 - ((value - minValue) / range) * 100
  }

  const formatValue = (value: number) => {
    if (data.unit === '$B') return `$${value.toFixed(1)}B`
    if (data.unit === '$M') return `$${value.toFixed(0)}M`
    if (data.unit === '%') return `${value.toFixed(1)}%`
    return value.toLocaleString()
  }

  const getColor = (item: SlopeData['items'][0], index: number) => {
    return item.color || palette.scale[index % palette.scale.length]
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-4"
    >
      {/* Header labels */}
      <div className="flex justify-between mb-6 px-20">
        <span className="text-sm font-semibold text-slate-700">{data.startLabel}</span>
        <span className="text-sm font-semibold text-slate-700">{data.endLabel}</span>
      </div>

      {/* Chart */}
      <div className="relative h-80">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {data.items.map((item, index) => {
            const color = getColor(item, index)
            const isHovered = hoveredItem === item.name
            const startY = getY(item.start)
            const endY = getY(item.end)

            return (
              <motion.g
                key={item.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Connecting line */}
                <motion.line
                  x1="15"
                  y1={startY}
                  x2="85"
                  y2={endY}
                  stroke={color}
                  strokeWidth={isHovered ? 3 : 2}
                  strokeOpacity={!hoveredItem || isHovered ? 1 : 0.2}
                  animate={{
                    strokeWidth: isHovered ? 3 : 2,
                    strokeOpacity: !hoveredItem || isHovered ? 1 : 0.2
                  }}
                />
                
                {/* Start dot */}
                <motion.circle
                  cx="15"
                  cy={startY}
                  r={isHovered ? 5 : 4}
                  fill={color}
                  fillOpacity={!hoveredItem || isHovered ? 1 : 0.3}
                />
                
                {/* End dot */}
                <motion.circle
                  cx="85"
                  cy={endY}
                  r={isHovered ? 5 : 4}
                  fill={color}
                  fillOpacity={!hoveredItem || isHovered ? 1 : 0.3}
                />
              </motion.g>
            )
          })}
        </svg>

        {/* Labels overlay */}
        {data.items.map((item, index) => {
          const color = getColor(item, index)
          const isHovered = hoveredItem === item.name
          const startY = getY(item.start)
          const endY = getY(item.end)

          return (
            <div key={item.name}>
              {/* Start label */}
              <div
                className="absolute left-0 transform -translate-y-1/2"
                style={{ 
                  top: `${startY}%`,
                  opacity: !hoveredItem || isHovered ? 1 : 0.3
                }}
              >
                <div className="text-right pr-2">
                  <span className="text-xs font-medium" style={{ color }}>
                    {formatValue(item.start)}
                  </span>
                </div>
              </div>

              {/* End label */}
              <div
                className="absolute right-0 transform -translate-y-1/2"
                style={{ 
                  top: `${endY}%`,
                  opacity: !hoveredItem || isHovered ? 1 : 0.3
                }}
              >
                <div className="text-left pl-2">
                  <span className="text-xs font-medium" style={{ color }}>
                    {formatValue(item.end)}
                  </span>
                  <span className="text-xs text-slate-500 ml-2">
                    {item.name}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="chart-legend chart-legend-horizontal mt-4">
        {data.items.map((item, i) => (
          <button
            key={item.name}
            type="button"
            className="chart-legend-item"
            style={{ opacity: !hoveredItem || hoveredItem === item.name ? 1 : 0.3 }}
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span className="chart-legend-dot" style={{ backgroundColor: getColor(item, i) }} />
            <span className="chart-legend-label">{item.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
