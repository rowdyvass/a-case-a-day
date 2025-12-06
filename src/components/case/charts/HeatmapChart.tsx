'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'
import { interpolateColors } from '@/lib/colors'

/**
 * HeatmapChart
 * 
 * Editorial-quality heatmap with:
 * - Brand-derived color scale
 * - Hover tooltips
 * - Smooth animations
 */

interface HeatmapData {
  rows: string[]
  columns: string[]
  values: number[][]
  unit?: string
  colorScale?: 'sequential' | 'diverging'
  minLabel?: string
  maxLabel?: string
}

interface HeatmapChartProps {
  data: HeatmapData
}

export function HeatmapChart({ data }: HeatmapChartProps) {
  const palette = useExhibitPalette()
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null)

  // Defensive check for missing or malformed data
  if (!data?.rows || !Array.isArray(data.rows) || data.rows.length === 0 ||
      !data?.columns || !Array.isArray(data.columns) || data.columns.length === 0 ||
      !data?.values || !Array.isArray(data.values) || data.values.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No heatmap data available</p>
      </div>
    )
  }

  // Calculate min/max
  const { minValue, maxValue } = useMemo(() => {
    const allValues = data.values.flat()
    return {
      minValue: Math.min(...allValues),
      maxValue: Math.max(...allValues)
    }
  }, [data.values])

  // Generate color scale
  const colorScale = useMemo(() => {
    if (data.colorScale === 'diverging') {
      return interpolateColors(palette.negative, palette.positive, 9)
    }
    return interpolateColors(palette.primaryLight, palette.primary, 9)
  }, [palette, data.colorScale])

  const getColor = (value: number) => {
    const normalized = (value - minValue) / (maxValue - minValue)
    const index = Math.min(Math.floor(normalized * (colorScale.length - 1)), colorScale.length - 1)
    return colorScale[index]
  }

  const formatValue = (value: number) => {
    if (data.unit === '$B') return `$${value.toFixed(1)}B`
    if (data.unit === '$M') return `$${value.toFixed(0)}M`
    if (data.unit === '%') return `${value.toFixed(1)}%`
    return value.toFixed(1)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-x-auto"
    >
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-xs font-medium text-slate-500 text-left"></th>
            {data.columns.map((col, i) => (
              <th 
                key={i}
                className="p-2 text-xs font-medium text-slate-600 text-center"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="p-2 text-xs font-medium text-slate-600 text-right pr-4">
                {row}
              </td>
              {data.columns.map((_, colIndex) => {
                const value = data.values[rowIndex]?.[colIndex] ?? 0
                const isHovered = hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex

                return (
                  <td 
                    key={colIndex}
                    className="p-1"
                    onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    <motion.div
                      className="relative h-12 rounded flex items-center justify-center cursor-pointer"
                      style={{ backgroundColor: getColor(value) }}
                      animate={{
                        scale: isHovered ? 1.05 : 1,
                        boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.15)' : '0 0 0 rgba(0,0,0,0)'
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <span 
                        className="text-xs font-medium"
                        style={{ color: value > (maxValue + minValue) / 2 ? '#fff' : palette.text }}
                      >
                        {formatValue(value)}
                      </span>

                      {/* Tooltip */}
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10"
                        >
                          <div className="chart-tooltip text-xs whitespace-nowrap">
                            <div className="font-medium">{row} × {data.columns[colIndex]}</div>
                            <div className="text-slate-600">{formatValue(value)}</div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Color scale legend */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="text-xs text-slate-500">{data.minLabel || formatValue(minValue)}</span>
        <div className="flex h-3 rounded-full overflow-hidden">
          {colorScale.map((color, i) => (
            <div 
              key={i}
              className="w-6 h-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="text-xs text-slate-500">{data.maxLabel || formatValue(maxValue)}</span>
      </div>
    </motion.div>
  )
}
