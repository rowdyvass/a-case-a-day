'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * DrilldownChart
 * 
 * Interactive chart with drill-down capability for hierarchical data.
 */

interface DrilldownItem {
  name: string
  value: number
  children?: DrilldownItem[]
  color?: string
}

interface DrilldownData {
  data: DrilldownItem[]
  unit?: string
  title?: string
}

interface DrilldownChartProps {
  data: DrilldownData
}

export function DrilldownChart({ data }: DrilldownChartProps) {
  const palette = useExhibitPalette()

  // Defensive check for missing or malformed data
  const initialData = data?.data && Array.isArray(data.data) ? data.data : []

  const [drillPath, setDrillPath] = useState<string[]>([])
  const [currentData, setCurrentData] = useState<DrilldownItem[]>(initialData)

  // Early return if no valid data
  if (initialData.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No drilldown chart data available</p>
      </div>
    )
  }

  const formatValue = (value: number) => {
    if (data.unit === '$B') return `$${value.toFixed(1)}B`
    if (data.unit === '$M') return `$${value.toFixed(0)}M`
    if (data.unit === '%') return `${value.toFixed(1)}%`
    return value.toLocaleString()
  }

  const getColor = (index: number) => {
    return palette.scale[index % palette.scale.length]
  }

  const handleBarClick = (item: DrilldownItem) => {
    if (item.children && item.children.length > 0) {
      setDrillPath([...drillPath, item.name])
      setCurrentData(item.children)
    }
  }

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      setDrillPath([])
      setCurrentData(initialData)
    } else {
      const newPath = drillPath.slice(0, index + 1)
      let newData = initialData
      for (const segment of newPath) {
        const found = newData.find(d => d.name === segment)
        if (found?.children) {
          newData = found.children
        }
      }
      setDrillPath(newPath)
      setCurrentData(newData)
    }
  }

  const CustomTooltip = ({ active, payload }: {
    active?: boolean
    payload?: Array<{ payload: DrilldownItem }>
  }) => {
    if (!active || !payload || payload.length === 0) return null

    const item = payload[0].payload
    const hasChildren = item.children && item.children.length > 0

    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-label">{item.name}</div>
        <div className="chart-tooltip-items">
          <div className="chart-tooltip-item">
            <span className="chart-tooltip-name">Value</span>
            <span className="chart-tooltip-value">{formatValue(item.value)}</span>
          </div>
        </div>
        {hasChildren && (
          <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            Click to drill down →
          </div>
        )}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={() => handleBreadcrumbClick(-1)}
          className="font-medium transition-colors"
          style={{ color: drillPath.length > 0 ? palette.primary : palette.text }}
        >
          {data.title || 'All'}
        </button>
        {drillPath.map((segment, index) => (
          <div key={segment} className="flex items-center gap-2">
            <span className="text-slate-400">›</span>
            <button
              onClick={() => handleBreadcrumbClick(index)}
              className="font-medium transition-colors"
              style={{ color: index === drillPath.length - 1 ? palette.text : palette.primary }}
            >
              {segment}
            </button>
          </div>
        ))}
      </div>

      {/* Chart */}
      <AnimatePresence mode="wait">
        <motion.div
          key={drillPath.join('/')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={currentData} margin={{ top: 20, right: 24, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={palette.gridLine} vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: palette.textMuted }}
                axisLine={{ stroke: palette.axisLine }}
                tickLine={{ stroke: palette.axisLine }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: palette.textMuted }}
                axisLine={{ stroke: palette.axisLine }}
                tickLine={false}
                tickFormatter={formatValue}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                animationDuration={500}
                onClick={(entry) => handleBarClick(entry)}
                style={{ cursor: 'pointer' }}
              >
                {currentData.map((entry, index) => (
                  <Cell 
                    key={entry.name}
                    fill={entry.color || getColor(index)}
                    opacity={entry.children && entry.children.length > 0 ? 1 : 0.7}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>

      {/* Hint */}
      {currentData.some(d => d.children && d.children.length > 0) && (
        <p className="text-xs text-slate-500 text-center">
          Click a bar to drill down into details
        </p>
      )}
    </motion.div>
  )
}
