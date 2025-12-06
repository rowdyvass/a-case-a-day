'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * LollipopChart
 * 
 * Editorial-quality lollipop chart for ranking or comparison.
 */

interface LollipopData {
  items: {
    name: string
    value: number
    color?: string
  }[]
  unit?: string
  horizontal?: boolean
  sorted?: boolean
}

interface LollipopChartProps {
  data: LollipopData
}

export function LollipopChart({ data }: LollipopChartProps) {
  const palette = useExhibitPalette()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Defensive check for missing or malformed data
  if (!data?.items || !Array.isArray(data.items) || data.items.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No lollipop chart data available</p>
      </div>
    )
  }

  const items = data.sorted 
    ? [...data.items].sort((a, b) => b.value - a.value)
    : data.items

  const maxValue = Math.max(...items.map(item => item.value))

  const formatValue = (value: number) => {
    if (data.unit === '$B') return `$${value.toFixed(1)}B`
    if (data.unit === '$M') return `$${value.toFixed(0)}M`
    if (data.unit === '%') return `${value.toFixed(1)}%`
    return value.toLocaleString()
  }

  const getColor = (item: LollipopData['items'][0], index: number) => {
    return item.color || palette.scale[index % palette.scale.length]
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`space-y-3 ${data.horizontal ? '' : 'flex gap-4 items-end h-80'}`}
    >
      {items.map((item, index) => {
        const color = getColor(item, index)
        const percentage = (item.value / maxValue) * 100
        const isHovered = hoveredItem === item.name

        if (data.horizontal) {
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-4"
              onMouseEnter={() => setHoveredItem(item.name)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Label */}
              <div className="w-28 flex-shrink-0 text-right">
                <span className="text-sm text-slate-600">{item.name}</span>
              </div>

              {/* Stick and dot */}
              <div className="flex-1 relative h-6 flex items-center">
                <motion.div
                  className="h-0.5 rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: palette.border
                  }}
                  animate={{
                    backgroundColor: isHovered ? color : palette.border
                  }}
                />
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    left: `${percentage}%`,
                    transform: 'translateX(-50%)',
                    width: isHovered ? 16 : 12,
                    height: isHovered ? 16 : 12,
                    backgroundColor: color
                  }}
                  animate={{
                    scale: isHovered ? 1.2 : 1,
                    boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              </div>

              {/* Value */}
              <div className="w-16 flex-shrink-0">
                <span 
                  className="text-sm font-medium"
                  style={{ color: isHovered ? color : palette.text }}
                >
                  {formatValue(item.value)}
                </span>
              </div>
            </motion.div>
          )
        }

        // Vertical layout
        return (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex-1 flex flex-col items-center cursor-pointer"
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Value */}
            <span 
              className="text-xs font-medium mb-2"
              style={{ color: isHovered ? color : palette.textMuted }}
            >
              {formatValue(item.value)}
            </span>

            {/* Dot */}
            <motion.div
              className="rounded-full z-10"
              style={{
                width: isHovered ? 14 : 10,
                height: isHovered ? 14 : 10,
                backgroundColor: color
              }}
              animate={{
                scale: isHovered ? 1.2 : 1,
                boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />

            {/* Stick */}
            <motion.div
              className="w-0.5 rounded-full"
              style={{
                height: `${percentage}%`,
                backgroundColor: palette.border
              }}
              animate={{
                backgroundColor: isHovered ? color : palette.border
              }}
            />

            {/* Label */}
            <span className="text-xs text-slate-600 mt-2 text-center">
              {item.name}
            </span>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
