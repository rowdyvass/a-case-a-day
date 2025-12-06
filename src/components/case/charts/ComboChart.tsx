'use client'

import { useState } from 'react'
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * ComboChart
 * 
 * Editorial-quality combination chart with:
 * - Bars and lines together
 * - Dual Y-axis support
 * - Interactive legend
 */

interface ComboData {
  labels: string[]
  bars: {
    label: string
    values: number[]
    color?: string
  }[]
  lines: {
    label: string
    values: number[]
    color?: string
    yAxisId?: 'left' | 'right'
  }[]
  barUnit?: string
  lineUnit?: string
  showRightAxis?: boolean
}

interface ComboChartProps {
  data: ComboData
}

export function ComboChart({ data }: ComboChartProps) {
  const palette = useExhibitPalette()
  const [activeItem, setActiveItem] = useState<string | null>(null)

  // Defensive check for missing or malformed data
  if (!data?.labels || !Array.isArray(data.labels) || data.labels.length === 0 ||
      (!data?.bars?.length && !data?.lines?.length)) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No combo chart data available</p>
      </div>
    )
  }

  // Ensure bars and lines are arrays
  const bars = Array.isArray(data.bars) ? data.bars : []
  const lines = Array.isArray(data.lines) ? data.lines : []

  const chartData = data.labels.map((label, i) => ({
    name: label,
    ...Object.fromEntries(bars.map(b => [b.label, b.values[i]])),
    ...Object.fromEntries(lines.map(l => [l.label, l.values[i]]))
  }))

  const formatValue = (value: number, unit?: string) => {
    if (unit === '$B') return `$${value.toFixed(1)}B`
    if (unit === '$M') return `$${value.toFixed(0)}M`
    if (unit === '%') return `${value.toFixed(1)}%`
    return value.toLocaleString()
  }

  const getBarColor = (index: number) => {
    return bars[index]?.color || palette.scale[index % palette.scale.length]
  }

  const getLineColor = (index: number) => {
    return lines[index]?.color || palette.scale[(bars.length + index) % palette.scale.length]
  }

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean
    payload?: Array<{ name: string; value: number; color: string; dataKey: string }>
    label?: string
  }) => {
    if (!active || !payload) return null

    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-label">{label}</div>
        <div className="chart-tooltip-items">
          {payload.map((entry, i) => {
            const isBar = bars.some(b => b.label === entry.dataKey)
            const unit = isBar ? data.barUnit : data.lineUnit
            return (
              <div key={i} className="chart-tooltip-item">
                <span className="chart-tooltip-dot" style={{ backgroundColor: entry.color }} />
                <span className="chart-tooltip-name">{entry.name}</span>
                <span className="chart-tooltip-value">{formatValue(entry.value, unit)}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart data={chartData} margin={{ top: 20, right: data.showRightAxis ? 50 : 24, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={palette.gridLine} vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11, fill: palette.textMuted }}
            axisLine={{ stroke: palette.axisLine }}
            tickLine={{ stroke: palette.axisLine }}
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 11, fill: palette.textMuted }}
            axisLine={{ stroke: palette.axisLine }}
            tickLine={false}
            tickFormatter={(v) => formatValue(v, data.barUnit)}
          />
          {data.showRightAxis && (
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: palette.textMuted }}
              axisLine={{ stroke: palette.axisLine }}
              tickLine={false}
              tickFormatter={(v) => formatValue(v, data.lineUnit)}
            />
          )}
          <Tooltip content={<CustomTooltip />} />
          
          {/* Bars */}
          {bars.map((bar, i) => (
            <Bar
              key={bar.label}
              dataKey={bar.label}
              yAxisId="left"
              fill={getBarColor(i)}
              radius={[4, 4, 0, 0]}
              opacity={!activeItem || activeItem === bar.label ? 1 : 0.3}
              animationDuration={800}
              animationBegin={i * 100}
            />
          ))}

          {/* Lines */}
          {lines.map((line, i) => (
            <Line
              key={line.label}
              type="monotone"
              dataKey={line.label}
              yAxisId={line.yAxisId || 'left'}
              stroke={getLineColor(i)}
              strokeWidth={2.5}
              dot={{ fill: getLineColor(i), r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
              opacity={!activeItem || activeItem === line.label ? 1 : 0.3}
              animationDuration={800}
              animationBegin={bars.length * 100 + i * 100}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="chart-legend chart-legend-horizontal">
        {bars.map((bar, i) => (
          <button
            key={bar.label}
            type="button"
            className="chart-legend-item"
            style={{ opacity: !activeItem || activeItem === bar.label ? 1 : 0.3 }}
            onMouseEnter={() => setActiveItem(bar.label)}
            onMouseLeave={() => setActiveItem(null)}
          >
            <span className="chart-legend-dot" style={{ backgroundColor: getBarColor(i) }} />
            <span className="chart-legend-label">{bar.label}</span>
          </button>
        ))}
        {lines.map((line, i) => (
          <button
            key={line.label}
            type="button"
            className="chart-legend-item"
            style={{ opacity: !activeItem || activeItem === line.label ? 1 : 0.3 }}
            onMouseEnter={() => setActiveItem(line.label)}
            onMouseLeave={() => setActiveItem(null)}
          >
            <span 
              className="w-4 h-0.5 rounded-full" 
              style={{ backgroundColor: getLineColor(i) }} 
            />
            <span className="chart-legend-label">{line.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
