'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * ComparisonGrid
 * 
 * Editorial-quality comparison grid with:
 * - Card-based layout
 * - Interactive hover states
 * - Highlight for winner/best option
 */

interface ComparisonItem {
  name: string
  description?: string
  metrics: {
    label: string
    value: string | number
    highlight?: boolean
  }[]
  badge?: string
  isRecommended?: boolean
}

interface ComparisonGridData {
  items: ComparisonItem[]
  columns?: 2 | 3 | 4
}

interface ComparisonGridProps {
  data: ComparisonGridData
}

export function ComparisonGrid({ data }: ComparisonGridProps) {
  const palette = useExhibitPalette()
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  // Safely access items array
  const items = Array.isArray(data?.items) ? data.items : []

  // Early return if no valid data
  if (items.length === 0) {
    return <p className="exhibit-empty">No comparison data available</p>
  }

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`comparison-grid grid ${gridCols[data?.columns || 3]} gap-4`}
    >
      {items.map((item, index) => {
        const isHovered = hoveredItem === index

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="comparison-item rounded-xl border-2 p-5 transition-all"
            style={{
              borderColor: item.isRecommended ? palette.primary : (isHovered ? palette.primary : palette.border),
              backgroundColor: item.isRecommended ? palette.primaryLight : 'white',
              boxShadow: isHovered ? '0 8px 24px -4px rgba(0,0,0,0.1)' : 'none'
            }}
            onMouseEnter={() => setHoveredItem(index)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Header */}
            <div className="comparison-header flex items-start justify-between mb-4">
              <div>
                <h4 className="comparison-title font-semibold text-slate-900">
                  {item.name}
                </h4>
                {item.description && (
                  <p className="text-xs text-slate-500 mt-1">
                    {item.description}
                  </p>
                )}
              </div>
              {item.badge && (
                <span 
                  className="comparison-badge text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: item.isRecommended ? palette.primary : palette.backgroundAlt,
                    color: item.isRecommended ? 'white' : palette.textMuted
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              {(Array.isArray(item.metrics) ? item.metrics : []).map((metric, metricIndex) => (
                <div 
                  key={metricIndex}
                  className="flex justify-between items-baseline"
                >
                  <span className="text-xs text-slate-500">{metric.label}</span>
                  <span 
                    className={`text-sm font-medium ${metric.highlight ? 'font-bold' : ''}`}
                    style={{ color: metric.highlight ? palette.primary : palette.text }}
                  >
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Recommended indicator */}
            {item.isRecommended && (
              <div 
                className="mt-4 pt-4 border-t text-center"
                style={{ borderTopColor: palette.primary }}
              >
                <span 
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: palette.primary }}
                >
                  ✓ Recommended
                </span>
              </div>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
