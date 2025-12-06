'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * PositioningMap
 * 
 * Editorial-quality 2x2 positioning map with:
 * - Quadrant labels
 * - Interactive data points
 * - Brand-derived colors
 */

interface PositionPoint {
  name: string
  x: number
  y: number
  size?: number
  color?: string
  isHighlighted?: boolean
}

interface PositioningMapData {
  points: PositionPoint[]
  xAxis: { label: string; lowLabel?: string; highLabel?: string }
  yAxis: { label: string; lowLabel?: string; highLabel?: string }
  quadrantLabels?: [string, string, string, string]
}

interface PositioningMapProps {
  data: PositioningMapData
}

export function PositioningMap({ data }: PositioningMapProps) {
  const palette = useExhibitPalette()
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)

  // Defensive check for missing or malformed data
  if (!data?.points || !Array.isArray(data.points) || data.points.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No positioning map data available</p>
      </div>
    )
  }

  const getColor = (point: PositionPoint, index: number) => {
    if (point.color) return point.color
    if (point.isHighlighted) return palette.primary
    return palette.scale[index % palette.scale.length]
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      {/* Map container */}
      <div 
        className="relative aspect-square max-w-lg mx-auto rounded-xl overflow-hidden"
        style={{ backgroundColor: palette.backgroundAlt }}
      >
        {/* Grid lines */}
        <div 
          className="absolute left-1/2 top-0 bottom-0 w-px"
          style={{ backgroundColor: palette.border }}
        />
        <div 
          className="absolute top-1/2 left-0 right-0 h-px"
          style={{ backgroundColor: palette.border }}
        />

        {/* Quadrant labels */}
        {data.quadrantLabels && (
          <>
            <div className="absolute top-4 left-4 text-xs font-medium text-slate-400">
              {data.quadrantLabels[0]}
            </div>
            <div className="absolute top-4 right-4 text-xs font-medium text-slate-400 text-right">
              {data.quadrantLabels[1]}
            </div>
            <div className="absolute bottom-4 left-4 text-xs font-medium text-slate-400">
              {data.quadrantLabels[2]}
            </div>
            <div className="absolute bottom-4 right-4 text-xs font-medium text-slate-400 text-right">
              {data.quadrantLabels[3]}
            </div>
          </>
        )}

        {/* Data points */}
        {data.points.map((point, index) => {
          const color = getColor(point, index)
          const size = point.size || 40
          const isHovered = hoveredPoint === point.name

          // Convert 0-100 scale to percentage position
          const left = `${point.x}%`
          const bottom = `${point.y}%`

          return (
            <motion.div
              key={point.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              className="absolute -translate-x-1/2 translate-y-1/2 cursor-pointer"
              style={{ left, bottom }}
              onMouseEnter={() => setHoveredPoint(point.name)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <motion.div
                className="rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: color,
                  border: point.isHighlighted ? '3px solid white' : 'none',
                  boxShadow: isHovered ? '0 8px 24px -4px rgba(0,0,0,0.25)' : '0 4px 12px rgba(0,0,0,0.15)'
                }}
                animate={{
                  scale: isHovered ? 1.15 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
              
              {/* Label */}
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0.8,
                  y: 0
                }}
                className="absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap"
              >
                <span 
                  className="text-xs font-medium px-2 py-1 rounded"
                  style={{ 
                    backgroundColor: isHovered ? palette.text : 'transparent',
                    color: isHovered ? 'white' : palette.text
                  }}
                >
                  {point.name}
                </span>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* Axis labels */}
      <div className="mt-4 flex justify-between text-xs">
        <span className="text-slate-400">{data.xAxis.lowLabel || 'Low'}</span>
        <span className="font-medium text-slate-600">{data.xAxis.label}</span>
        <span className="text-slate-400">{data.xAxis.highLabel || 'High'}</span>
      </div>

      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-4 flex flex-col items-end text-xs">
        <span className="text-slate-400 mb-auto">{data.yAxis.highLabel || 'High'}</span>
        <span 
          className="font-medium text-slate-600"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          {data.yAxis.label}
        </span>
        <span className="text-slate-400 mt-auto">{data.yAxis.lowLabel || 'Low'}</span>
      </div>

      {/* Legend */}
      <div className="chart-legend chart-legend-horizontal mt-6 flex-wrap">
        {data.points.map((point, i) => (
          <button
            key={point.name}
            type="button"
            className="chart-legend-item"
            style={{ opacity: !hoveredPoint || hoveredPoint === point.name ? 1 : 0.3 }}
            onMouseEnter={() => setHoveredPoint(point.name)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <span className="chart-legend-dot" style={{ backgroundColor: getColor(point, i) }} />
            <span className="chart-legend-label">{point.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
