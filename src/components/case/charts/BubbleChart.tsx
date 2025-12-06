'use client'

import { useState } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Cell } from 'recharts'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * BubbleChart
 * 
 * Editorial-quality bubble chart with:
 * - Size encoding for third dimension
 * - Interactive hover states
 * - Brand-derived colors
 */

interface BubbleData {
  points: {
    name: string
    x: number
    y: number
    z: number
    color?: string
    category?: string
  }[]
  xLabel?: string
  yLabel?: string
  zLabel?: string
  xUnit?: string
  yUnit?: string
  zUnit?: string
}

interface BubbleChartProps {
  data: BubbleData
}

export function BubbleChart({ data }: BubbleChartProps) {
  const palette = useExhibitPalette()
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)

  // Defensive check for missing or malformed data
  if (!data?.points || !Array.isArray(data.points) || data.points.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No bubble chart data available</p>
      </div>
    )
  }

  const formatValue = (value: number, unit?: string) => {
    if (unit === '$B') return `$${value.toFixed(1)}B`
    if (unit === '$M') return `$${value.toFixed(0)}M`
    if (unit === '%') return `${value.toFixed(1)}%`
    return value.toLocaleString()
  }

  const getColor = (point: BubbleData['points'][0], index: number) => {
    if (point.color) return point.color
    return palette.scale[index % palette.scale.length]
  }

  const CustomTooltip = ({ active, payload }: {
    active?: boolean
    payload?: Array<{ payload: BubbleData['points'][0] }>
  }) => {
    if (!active || !payload || payload.length === 0) return null

    const point = payload[0].payload

    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-label font-semibold">{point.name}</div>
        <div className="chart-tooltip-items mt-2">
          <div className="chart-tooltip-item">
            <span className="chart-tooltip-name">{data.xLabel || 'X'}</span>
            <span className="chart-tooltip-value">{formatValue(point.x, data.xUnit)}</span>
          </div>
          <div className="chart-tooltip-item">
            <span className="chart-tooltip-name">{data.yLabel || 'Y'}</span>
            <span className="chart-tooltip-value">{formatValue(point.y, data.yUnit)}</span>
          </div>
          <div className="chart-tooltip-item">
            <span className="chart-tooltip-name">{data.zLabel || 'Size'}</span>
            <span className="chart-tooltip-value">{formatValue(point.z, data.zUnit)}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <ResponsiveContainer width="100%" height={360}>
        <ScatterChart margin={{ top: 20, right: 24, left: 8, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={palette.gridLine} />
          <XAxis 
            dataKey="x" 
            name={data.xLabel}
            tick={{ fontSize: 11, fill: palette.textMuted }}
            axisLine={{ stroke: palette.axisLine }}
            tickLine={{ stroke: palette.axisLine }}
            label={{ value: data.xLabel, position: 'bottom', fill: palette.textMuted, fontSize: 12 }}
          />
          <YAxis 
            dataKey="y" 
            name={data.yLabel}
            tick={{ fontSize: 11, fill: palette.textMuted }}
            axisLine={{ stroke: palette.axisLine }}
            tickLine={false}
            label={{ value: data.yLabel, angle: -90, position: 'insideLeft', fill: palette.textMuted, fontSize: 12 }}
          />
          <ZAxis dataKey="z" range={[100, 1000]} name={data.zLabel} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter 
            data={data.points} 
            animationDuration={800}
            onMouseEnter={(entry) => setHoveredPoint(entry.name)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            {data.points.map((point, index) => (
              <Cell 
                key={point.name}
                fill={getColor(point, index)}
                fillOpacity={!hoveredPoint || hoveredPoint === point.name ? 0.7 : 0.2}
                stroke={getColor(point, index)}
                strokeWidth={hoveredPoint === point.name ? 3 : 1}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="chart-legend chart-legend-horizontal flex-wrap">
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
