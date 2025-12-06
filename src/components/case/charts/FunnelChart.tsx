'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * FunnelChart
 * 
 * Editorial-quality funnel visualization with:
 * - Gradient fills
 * - Hover interactions
 * - Conversion rate indicators
 */

interface FunnelStage {
  name: string
  value: number
  color?: string
}

interface FunnelData {
  stages: FunnelStage[]
  unit?: string
  showConversion?: boolean
}

interface FunnelChartProps {
  data: FunnelData
}

export function FunnelChart({ data }: FunnelChartProps) {
  const palette = useExhibitPalette()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Defensive check for missing or malformed data
  if (!data?.stages || !Array.isArray(data.stages) || data.stages.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No funnel chart data available</p>
      </div>
    )
  }

  const maxValue = Math.max(...data.stages.map(s => s.value))

  const formatValue = (value: number) => {
    if (data.unit === '$B') return `$${value.toFixed(1)}B`
    if (data.unit === '$M') return `$${value.toFixed(0)}M`
    if (data.unit === '$K') return `$${value.toFixed(0)}K`
    if (data.unit === '%') return `${value.toFixed(1)}%`
    return value.toLocaleString()
  }

  const getConversionRate = (index: number) => {
    if (index === 0) return 100
    return ((data.stages[index].value / data.stages[index - 1].value) * 100).toFixed(1)
  }

  const getColor = (index: number) => {
    return data.stages[index]?.color || palette.scale[index % palette.scale.length]
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-4"
    >
      <div className="space-y-2">
        {data.stages.map((stage, index) => {
          const widthPercent = (stage.value / maxValue) * 100
          const color = getColor(index)
          const isHovered = hoveredIndex === index

          return (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center gap-4">
                {/* Label */}
                <div className="w-32 flex-shrink-0 text-right">
                  <span className="text-sm font-medium text-slate-700">{stage.name}</span>
                </div>

                {/* Bar */}
                <div className="flex-1 relative">
                  <motion.div
                    className="h-12 rounded-lg flex items-center justify-end px-4 cursor-pointer"
                    style={{
                      width: `${widthPercent}%`,
                      backgroundColor: color,
                      boxShadow: isHovered ? '0 4px 12px -2px rgba(0,0,0,0.15)' : 'none'
                    }}
                    animate={{ 
                      scale: isHovered ? 1.02 : 1,
                      filter: isHovered ? 'brightness(1.05)' : 'brightness(1)'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <span className="text-white font-semibold text-sm">
                      {formatValue(stage.value)}
                    </span>
                  </motion.div>
                </div>

                {/* Conversion rate */}
                {data.showConversion !== false && index > 0 && (
                  <div className="w-16 flex-shrink-0 text-right">
                    <span className="text-xs text-slate-500">
                      {getConversionRate(index)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Connector line */}
              {index < data.stages.length - 1 && (
                <div className="ml-32 pl-4 py-1">
                  <div 
                    className="w-0.5 h-3 ml-auto mr-8"
                    style={{ 
                      backgroundColor: palette.border,
                      marginRight: `${100 - widthPercent}%`
                    }}
                  />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {data.showConversion !== false && (
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Overall Conversion</span>
            <span className="font-semibold" style={{ color: palette.primary }}>
              {((data.stages[data.stages.length - 1].value / data.stages[0].value) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}
