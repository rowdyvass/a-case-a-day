'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * HistogramChart
 * 
 * Editorial-quality histogram for distribution visualization.
 */

interface HistogramData {
  bins: {
    range: string
    count: number
  }[]
  unit?: string
  mean?: number
  median?: number
}

interface HistogramChartProps {
  data: HistogramData
}

export function HistogramChart({ data }: HistogramChartProps) {
  const palette = useExhibitPalette()
  const [hoveredBin, setHoveredBin] = useState<number | null>(null)

  const maxCount = Math.max(...data.bins.map(b => b.count))

  const CustomTooltip = ({ active, payload }: {
    active?: boolean
    payload?: Array<{ payload: { range: string; count: number } }>
  }) => {
    if (!active || !payload || payload.length === 0) return null

    const bin = payload[0].payload

    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-label">{bin.range}</div>
        <div className="chart-tooltip-items">
          <div className="chart-tooltip-item">
            <span className="chart-tooltip-name">Count</span>
            <span className="chart-tooltip-value">{bin.count.toLocaleString()}</span>
          </div>
          <div className="chart-tooltip-item">
            <span className="chart-tooltip-name">Percentage</span>
            <span className="chart-tooltip-value">
              {((bin.count / data.bins.reduce((s, b) => s + b.count, 0)) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data.bins} margin={{ top: 20, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={palette.gridLine} vertical={false} />
          <XAxis 
            dataKey="range" 
            tick={{ fontSize: 10, fill: palette.textMuted }}
            axisLine={{ stroke: palette.axisLine }}
            tickLine={{ stroke: palette.axisLine }}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: palette.textMuted }}
            axisLine={{ stroke: palette.axisLine }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
          
          {data.mean !== undefined && (
            <ReferenceLine 
              x={data.mean} 
              stroke={palette.negative}
              strokeDasharray="4 4"
              label={{ value: 'Mean', position: 'top', fill: palette.negative, fontSize: 11 }}
            />
          )}
          
          {data.median !== undefined && (
            <ReferenceLine 
              x={data.median} 
              stroke={palette.positive}
              strokeDasharray="4 4"
              label={{ value: 'Median', position: 'top', fill: palette.positive, fontSize: 11 }}
            />
          )}

          <Bar 
            dataKey="count" 
            radius={[2, 2, 0, 0]}
            animationDuration={800}
            onMouseEnter={(_, index) => setHoveredBin(index)}
            onMouseLeave={() => setHoveredBin(null)}
          >
            {data.bins.map((entry, index) => {
              const intensity = entry.count / maxCount
              return (
                <Cell 
                  key={index}
                  fill={palette.primary}
                  opacity={hoveredBin === null || hoveredBin === index ? 0.4 + intensity * 0.6 : 0.2}
                />
              )
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Stats */}
      <div className="chart-legend chart-legend-horizontal mt-4">
        <div className="chart-legend-item">
          <span className="chart-legend-dot" style={{ backgroundColor: palette.primary }} />
          <span className="chart-legend-label">Distribution</span>
        </div>
        {data.mean !== undefined && (
          <div className="chart-legend-item">
            <span className="w-4 h-0.5 border-t-2 border-dashed" style={{ borderColor: palette.negative }} />
            <span className="chart-legend-label">Mean</span>
          </div>
        )}
        {data.median !== undefined && (
          <div className="chart-legend-item">
            <span className="w-4 h-0.5 border-t-2 border-dashed" style={{ borderColor: palette.positive }} />
            <span className="chart-legend-label">Median</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
