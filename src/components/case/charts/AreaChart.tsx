'use client'

import { useState } from 'react'
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * AreaChart
 * 
 * Editorial-quality area chart with:
 * - Gradient fills using brand palette
 * - Interactive legend
 * - Smooth animations
 */

interface AreaChartData {
  labels: string[]
  datasets: {
    label: string
    values: number[]
    color?: string
  }[]
  stacked?: boolean
  unit?: string
  showGrid?: boolean
}

interface AreaChartProps {
  data: AreaChartData
}

export function AreaChartComponent({ data }: AreaChartProps) {
  const palette = useExhibitPalette()
  const [activeDataset, setActiveDataset] = useState<string | null>(null)

  // Defensive check for missing or malformed data
  if (!data?.labels || !Array.isArray(data.labels) || data.labels.length === 0 ||
      !data?.datasets || !Array.isArray(data.datasets) || data.datasets.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No area chart data available</p>
      </div>
    )
  }

  const chartData = data.labels.map((label, i) => ({
    name: label,
    ...Object.fromEntries(data.datasets.map(ds => [ds.label, ds.values[i]]))
  }))

  const formatValue = (value: number) => {
    if (data.unit === '$B') return `$${value.toFixed(1)}B`
    if (data.unit === '$M') return `$${value.toFixed(0)}M`
    if (data.unit === '%') return `${value.toFixed(1)}%`
    return value.toLocaleString()
  }

  const getColor = (index: number) => {
    return data.datasets[index]?.color || palette.scale[index % palette.scale.length]
  }

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean
    payload?: Array<{ name: string; value: number; color: string }>
    label?: string
  }) => {
    if (!active || !payload) return null

    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-label">{label}</div>
        <div className="chart-tooltip-items">
          {payload.map((entry, i) => (
            <div key={i} className="chart-tooltip-item">
              <span className="chart-tooltip-dot" style={{ backgroundColor: entry.color }} />
              <span className="chart-tooltip-name">{entry.name}</span>
              <span className="chart-tooltip-value">{formatValue(entry.value)}</span>
            </div>
          ))}
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
      <ResponsiveContainer width="100%" height={320}>
        <RechartsAreaChart data={chartData} margin={{ top: 20, right: 24, left: 8, bottom: 8 }}>
          <defs>
            {data.datasets.map((ds, i) => (
              <linearGradient key={ds.label} id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getColor(i)} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={getColor(i)} stopOpacity={0.05}/>
              </linearGradient>
            ))}
          </defs>
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
          <Tooltip content={<CustomTooltip />} />
          {data.datasets.map((ds, i) => (
            <Area
              key={ds.label}
              type="monotone"
              dataKey={ds.label}
              stackId={data.stacked ? 'stack' : undefined}
              stroke={getColor(i)}
              strokeWidth={2}
              fill={`url(#gradient-${i})`}
              opacity={activeDataset && activeDataset !== ds.label ? 0.3 : 1}
              animationDuration={800}
              animationBegin={i * 100}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
      
      <div className="chart-legend chart-legend-horizontal">
        {data.datasets.map((ds, i) => (
          <button
            key={ds.label}
            type="button"
            className="chart-legend-item"
            style={{ opacity: !activeDataset || activeDataset === ds.label ? 1 : 0.3 }}
            onMouseEnter={() => setActiveDataset(ds.label)}
            onMouseLeave={() => setActiveDataset(null)}
          >
            <span className="chart-legend-dot" style={{ backgroundColor: getColor(i) }} />
            <span className="chart-legend-label">{ds.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
