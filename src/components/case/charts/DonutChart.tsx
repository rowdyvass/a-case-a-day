'use client'

import { useState, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * DonutChart
 * 
 * Editorial-quality donut chart with:
 * - Central metric display
 * - Active slice expansion
 * - Refined segment styling
 * - Interactive legend grid
 */

interface DonutData {
  values: {
    label: string
    value: number
    color?: string
  }[]
  centerLabel?: string
  centerValue?: string | number
  unit?: string
  showPercentages?: boolean
}

interface DonutChartProps {
  data: DonutData
}

// Active shape renderer for hover effect
const renderActiveShape = (props: {
  cx: number
  cy: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
  payload: { label: string; value: number }
  percent: number
}) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}
      />
    </g>
  )
}

export function DonutChart({ data }: DonutChartProps) {
  const palette = useExhibitPalette()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // Safely access values with fallback to empty array
  const values = data?.values ?? []

  // Calculate total
  const total = useMemo(() => {
    return values.reduce((sum, item) => sum + item.value, 0)
  }, [values])

  // Early return if no data
  if (!values.length) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <span>No data available</span>
      </div>
    )
  }

  // Format value
  const formatValue = (value: number) => {
    if (data.unit === '$B') return `$${value.toFixed(1)}B`
    if (data.unit === '$M') return `$${value.toFixed(0)}M`
    if (data.unit === '$K') return `$${value.toFixed(0)}K`
    if (data.unit === '%') return `${value.toFixed(1)}%`
    return value.toLocaleString()
  }

  // Prepare chart data
  const chartData = values.map((item, i) => ({
    name: item.label,
    value: item.value,
    color: item.color || palette.scale[i % palette.scale.length],
    percent: (item.value / total) * 100
  }))

  // Get center display values
  const centerValue = data.centerValue !== undefined 
    ? data.centerValue 
    : (activeIndex !== null ? chartData[activeIndex]?.value : total)
  
  const centerLabel = data.centerLabel || (activeIndex !== null ? chartData[activeIndex]?.name : 'Total')

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="relative">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              activeIndex={activeIndex ?? undefined}
              activeShape={renderActiveShape}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              animationDuration={800}
              animationBegin={0}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="#fff"
                  strokeWidth={2}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center content */}
        <div className="donut-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={String(centerValue)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="text-center"
            >
              <div className="donut-center-value">
                {typeof centerValue === 'number' ? formatValue(centerValue) : centerValue}
              </div>
              <div className="donut-center-label">{centerLabel}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
        {chartData.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
              activeIndex === i 
                ? 'bg-slate-100' 
                : 'bg-slate-50/50 hover:bg-slate-50'
            }`}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <span 
              className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-700 truncate">
                {item.name}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  {formatValue(item.value)}
                </span>
                {data.showPercentages !== false && (
                  <span className="text-xs text-slate-400">
                    {item.percent.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
