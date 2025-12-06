'use client'

import { useState } from 'react'
import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * RadarChart
 * 
 * Editorial-quality radar/spider chart with:
 * - Multiple series support
 * - Interactive legend
 * - Brand-derived colors
 */

interface RadarData {
  categories: string[]
  series: {
    name: string
    values: number[]
    color?: string
  }[]
  maxValue?: number
  showLegend?: boolean
}

interface RadarChartProps {
  data: RadarData
}

export function RadarChartComponent({ data }: RadarChartProps) {
  const palette = useExhibitPalette()
  const [activeSeries, setActiveSeries] = useState<string | null>(null)

  // Safely access arrays with defaults
  const categories = Array.isArray(data?.categories) ? data.categories : []
  const series = Array.isArray(data?.series) ? data.series : []

  // Early return if no valid data
  if (categories.length === 0 || series.length === 0) {
    return <p className="exhibit-empty">No radar chart data available</p>
  }

  const chartData = categories.map((category, i) => ({
    subject: category,
    ...Object.fromEntries(series.map(s => [s.name, s.values?.[i] ?? 0]))
  }))

  const getColor = (index: number) => {
    return series[index]?.color || palette.scale[index % palette.scale.length]
  }

  const CustomTooltip = ({ active, payload }: {
    active?: boolean
    payload?: Array<{ name: string; value: number; color: string; payload: { subject: string } }>
  }) => {
    if (!active || !payload || payload.length === 0) return null

    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-label">{payload[0]?.payload?.subject}</div>
        <div className="chart-tooltip-items">
          {payload.map((entry, i) => (
            <div key={i} className="chart-tooltip-item">
              <span className="chart-tooltip-dot" style={{ backgroundColor: entry.color }} />
              <span className="chart-tooltip-name">{entry.name}</span>
              <span className="chart-tooltip-value">{entry.value.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ResponsiveContainer width="100%" height={360}>
        <RechartsRadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke={palette.gridLine} />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fontSize: 11, fill: palette.textMuted }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, data?.maxValue || 'auto']}
            tick={{ fontSize: 10, fill: palette.textSubtle }}
          />
          <Tooltip content={<CustomTooltip />} />
          {series.map((s, i) => {
            const color = getColor(i)
            const isActive = activeSeries === null || activeSeries === s.name

            return (
              <Radar
                key={s.name}
                name={s.name}
                dataKey={s.name}
                stroke={color}
                fill={color}
                fillOpacity={isActive ? 0.25 : 0.05}
                strokeWidth={isActive ? 2.5 : 1}
                strokeOpacity={isActive ? 1 : 0.3}
                animationDuration={800}
                animationBegin={i * 100}
              />
            )
          })}
        </RechartsRadarChart>
      </ResponsiveContainer>

      {data?.showLegend !== false && series.length > 0 && (
        <div className="chart-legend chart-legend-horizontal">
          {series.map((s, i) => (
            <button
              key={s.name}
              type="button"
              className="chart-legend-item"
              style={{ opacity: !activeSeries || activeSeries === s.name ? 1 : 0.3 }}
              onMouseEnter={() => setActiveSeries(s.name)}
              onMouseLeave={() => setActiveSeries(null)}
            >
              <span className="chart-legend-dot" style={{ backgroundColor: getColor(i) }} />
              <span className="chart-legend-label">{s.name}</span>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  )
}
