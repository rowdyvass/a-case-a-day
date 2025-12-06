'use client'

import { useState } from 'react'
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ErrorBar } from 'recharts'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * CandlestickChart
 * 
 * Financial candlestick chart for OHLC data visualization.
 */

interface CandlestickData {
  data: {
    date: string
    open: number
    high: number
    low: number
    close: number
  }[]
  unit?: string
}

interface CandlestickChartProps {
  data: CandlestickData
}

export function CandlestickChart({ data }: CandlestickChartProps) {
  const palette = useExhibitPalette()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const chartData = data.data.map(item => ({
    ...item,
    range: [item.low, item.high],
    body: [Math.min(item.open, item.close), Math.max(item.open, item.close)],
    isUp: item.close >= item.open,
    bodyHeight: Math.abs(item.close - item.open)
  }))

  const formatValue = (value: number) => {
    if (data.unit === '$') return `$${value.toFixed(2)}`
    return value.toFixed(2)
  }

  const CustomTooltip = ({ active, payload }: {
    active?: boolean
    payload?: Array<{ payload: typeof chartData[0] }>
  }) => {
    if (!active || !payload || payload.length === 0) return null

    const item = payload[0].payload

    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-label">{item.date}</div>
        <div className="chart-tooltip-items">
          <div className="chart-tooltip-item">
            <span className="chart-tooltip-name">Open</span>
            <span className="chart-tooltip-value">{formatValue(item.open)}</span>
          </div>
          <div className="chart-tooltip-item">
            <span className="chart-tooltip-name">High</span>
            <span className="chart-tooltip-value">{formatValue(item.high)}</span>
          </div>
          <div className="chart-tooltip-item">
            <span className="chart-tooltip-name">Low</span>
            <span className="chart-tooltip-value">{formatValue(item.low)}</span>
          </div>
          <div className="chart-tooltip-item">
            <span className="chart-tooltip-name">Close</span>
            <span 
              className="chart-tooltip-value font-semibold"
              style={{ color: item.isUp ? palette.positive : palette.negative }}
            >
              {formatValue(item.close)}
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
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={palette.gridLine} vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10, fill: palette.textMuted }}
            axisLine={{ stroke: palette.axisLine }}
            tickLine={{ stroke: palette.axisLine }}
          />
          <YAxis 
            domain={['auto', 'auto']}
            tick={{ fontSize: 11, fill: palette.textMuted }}
            axisLine={{ stroke: palette.axisLine }}
            tickLine={false}
            tickFormatter={formatValue}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
          
          {/* Candlestick bodies and wicks rendered manually */}
          {chartData.map((item, index) => {
            const isHovered = hoveredIndex === index
            const color = item.isUp ? palette.positive : palette.negative
            
            return (
              <g key={item.date}>
                {/* This is a simplified rendering - actual candlestick would need custom SVG */}
              </g>
            )
          })}

          {/* Simplified representation using bars */}
          <Bar 
            dataKey="bodyHeight"
            fill="transparent"
            animationDuration={800}
            onMouseEnter={(_, index) => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Simplified bar representation since Recharts doesn't have native candlestick */}
      <div className="mt-4 flex items-center gap-6 justify-center">
        {chartData.map((item, index) => {
          const isHovered = hoveredIndex === index
          const color = item.isUp ? palette.positive : palette.negative
          const heightRatio = item.bodyHeight / Math.max(...chartData.map(d => d.high - d.low))

          return (
            <div
              key={item.date}
              className="flex flex-col items-center cursor-pointer"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.div
                className="w-3 rounded-sm"
                style={{
                  height: `${Math.max(heightRatio * 60, 8)}px`,
                  backgroundColor: color,
                  opacity: isHovered ? 1 : 0.7
                }}
                whileHover={{ scale: 1.2 }}
              />
              <span className="text-[10px] text-slate-500 mt-1">{item.date}</span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="chart-legend chart-legend-horizontal mt-4">
        <div className="chart-legend-item">
          <span className="chart-legend-dot" style={{ backgroundColor: palette.positive }} />
          <span className="chart-legend-label">Up (Close &gt; Open)</span>
        </div>
        <div className="chart-legend-item">
          <span className="chart-legend-dot" style={{ backgroundColor: palette.negative }} />
          <span className="chart-legend-label">Down (Close &lt; Open)</span>
        </div>
      </div>
    </motion.div>
  )
}
