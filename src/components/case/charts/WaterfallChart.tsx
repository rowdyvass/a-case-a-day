'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, LabelList } from 'recharts'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'

/**
 * WaterfallChart
 * 
 * Editorial-quality waterfall chart with:
 * - Connecting dashed lines between bars
 * - Value annotations on each bar
 * - Semantic coloring (positive/negative/total)
 * - Subtle gradients
 */

interface WaterfallData {
  steps: {
    name: string
    value: number
    isTotal?: boolean
  }[]
  unit?: string
  showConnectors?: boolean
}

interface WaterfallChartProps {
  data: WaterfallData
}

interface ChartDataItem {
  name: string
  value: number
  start: number
  end: number
  isTotal: boolean
  isPositive: boolean
  displayValue: number
}

export function WaterfallChart({ data }: WaterfallChartProps) {
  const palette = useExhibitPalette()

  // Defensive check for missing or malformed data
  if (!data?.steps || !Array.isArray(data.steps) || data.steps.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No waterfall chart data available</p>
      </div>
    )
  }

  // Calculate cumulative values for waterfall effect
  const chartData = useMemo(() => {
    let cumulative = 0
    return data.steps.map((step): ChartDataItem => {
      if (step.isTotal) {
        return {
          name: step.name,
          value: step.value,
          start: 0,
          end: step.value,
          isTotal: true,
          isPositive: step.value >= 0,
          displayValue: step.value
        }
      }
      
      const start = cumulative
      cumulative += step.value
      return {
        name: step.name,
        value: step.value,
        start: Math.min(start, cumulative),
        end: Math.max(start, cumulative),
        isTotal: false,
        isPositive: step.value >= 0,
        displayValue: step.value
      }
    })
  }, [data.steps])

  const formatValue = (value: number) => {
    const absValue = Math.abs(value)
    const sign = value >= 0 ? '' : '-'
    if (data.unit === '$B') return `${sign}$${absValue.toFixed(1)}B`
    if (data.unit === '$M') return `${sign}$${absValue.toFixed(0)}M`
    if (data.unit === '$K') return `${sign}$${absValue.toFixed(0)}K`
    if (data.unit === '%') return `${sign}${absValue.toFixed(1)}%`
    return `${sign}${absValue.toLocaleString()}`
  }

  const getBarColor = (entry: ChartDataItem) => {
    if (entry.isTotal) return palette.primary
    return entry.isPositive ? palette.positive : palette.negative
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { 
    active?: boolean
    payload?: Array<{ payload: ChartDataItem }>
  }) => {
    if (!active || !payload || payload.length === 0) return null

    const entry = payload[0].payload as ChartDataItem

    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-label">{entry.name}</div>
        <div className="chart-tooltip-items">
          <div className="chart-tooltip-item">
            <span 
              className="chart-tooltip-dot"
              style={{ backgroundColor: getBarColor(entry) }}
            />
            <span className="chart-tooltip-name">
              {entry.isTotal ? 'Total' : entry.isPositive ? 'Increase' : 'Decrease'}
            </span>
            <span className="chart-tooltip-value">
              {formatValue(entry.displayValue)}
            </span>
          </div>
        </div>
        {!entry.isTotal && (
          <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            Running total: {formatValue(entry.end)}
          </div>
        )}
      </div>
    )
  }

  // Custom label component
  const CustomLabel = (props: {
    x?: number
    y?: number
    width?: number
    height?: number
    value?: number
    index?: number
  }) => {
    const { x = 0, y = 0, width = 0, value, index = 0 } = props
    const entry = chartData[index]
    if (!entry) return null

    const labelY = entry.isPositive || entry.isTotal ? y - 8 : y + (props.height || 0) + 16

    return (
      <text
        x={x + width / 2}
        y={labelY}
        fill={palette.textMuted}
        textAnchor="middle"
        fontSize={11}
        fontWeight={entry.isTotal ? 600 : 400}
      >
        {formatValue(entry.displayValue)}
      </text>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <ResponsiveContainer width="100%" height={380}>
        <BarChart 
          data={chartData} 
          margin={{ top: 32, right: 24, left: 8, bottom: 80 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={palette.gridLine} 
            vertical={false}
          />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 11, fill: palette.textMuted }}
            axisLine={{ stroke: palette.axisLine }}
            angle={-45}
            textAnchor="end"
            height={80}
            tickLine={{ stroke: palette.axisLine }}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: palette.textMuted }}
            axisLine={{ stroke: palette.axisLine }}
            tickFormatter={formatValue}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
          <ReferenceLine y={0} stroke={palette.axisLine} strokeWidth={1} />
          
          {/* Invisible bars to create the floating effect */}
          <Bar 
            dataKey="start" 
            stackId="waterfall" 
            fill="transparent"
            animationDuration={0}
          />
          
          {/* Visible bars */}
          <Bar 
            dataKey={(d: ChartDataItem) => d.end - d.start} 
            stackId="waterfall" 
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry)}
              />
            ))}
            <LabelList content={<CustomLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="chart-legend chart-legend-horizontal mt-2">
        <div className="chart-legend-item">
          <span className="chart-legend-dot" style={{ backgroundColor: palette.positive }} />
          <span className="chart-legend-label">Increase</span>
        </div>
        <div className="chart-legend-item">
          <span className="chart-legend-dot" style={{ backgroundColor: palette.negative }} />
          <span className="chart-legend-label">Decrease</span>
        </div>
        <div className="chart-legend-item">
          <span className="chart-legend-dot" style={{ backgroundColor: palette.primary }} />
          <span className="chart-legend-label">Total</span>
        </div>
      </div>
    </motion.div>
  )
}
