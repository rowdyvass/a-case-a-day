'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, LabelList } from 'recharts'
import { motion } from 'framer-motion'
import { useExhibitPalette } from '../ExhibitContext'
import { ChartTooltip } from './shared'

/**
 * StackedBarChart
 * 
 * Editorial-quality stacked bar chart with:
 * - Brand-derived color palette
 * - Animated segments
 * - Interactive legend with highlighting
 * - Inline value labels
 */

interface StackedBarData {
  labels: string[]
  datasets: {
    label: string
    values: number[]
    color?: string
  }[]
  horizontal?: boolean
  showPercentages?: boolean
  showLabels?: boolean
  unit?: string
}

interface StackedBarChartProps {
  data: StackedBarData
}

export function StackedBarChart({ data }: StackedBarChartProps) {
  const palette = useExhibitPalette()
  const [activeDataset, setActiveDataset] = useState<string | null>(null)
  const [isAnimated, setIsAnimated] = useState(true)

  // Defensive check for missing or malformed data
  if (!data?.labels || !Array.isArray(data.labels) || data.labels.length === 0 ||
      !data?.datasets || !Array.isArray(data.datasets) || data.datasets.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        <p className="text-sm">No stacked bar chart data available</p>
      </div>
    )
  }

  // Build chart data
  const chartData = data.labels.map((label, i) => {
    const point: Record<string, string | number> = { name: label }
    let total = 0
    data.datasets.forEach(dataset => {
      point[dataset.label] = dataset.values[i]
      total += dataset.values[i]
    })
    point.total = total
    return point
  })

  // Get colors from palette
  const getColor = (index: number, datasetLabel: string) => {
    const datasetColor = data.datasets[index]?.color
    if (datasetColor) return datasetColor
    return palette.scale[index % palette.scale.length]
  }

  // Format values
  const formatValue = (value: number) => {
    if (data.unit === '$B') return `$${value.toFixed(1)}B`
    if (data.unit === '$M') return `$${value.toFixed(0)}M`
    if (data.unit === '$K') return `$${value.toFixed(0)}K`
    if (data.unit === '%') return `${value.toFixed(1)}%`
    return value.toLocaleString()
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: { 
    active?: boolean
    payload?: Array<{ name: string; value: number; color: string }>
    label?: string 
  }) => {
    if (!active || !payload || payload.length === 0) return null

    const total = payload.reduce((sum, entry) => sum + entry.value, 0)

    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-label">{label}</div>
        <div className="chart-tooltip-items">
          {payload.map((entry, i) => (
            <div key={i} className="chart-tooltip-item">
              <span 
                className="chart-tooltip-dot"
                style={{ backgroundColor: entry.color }}
              />
              <span className="chart-tooltip-name">{entry.name}</span>
              <span className="chart-tooltip-value">
                {formatValue(entry.value)}
                {data.showPercentages && (
                  <span className="text-slate-400 ml-1">
                    ({((entry.value / total) * 100).toFixed(0)}%)
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
        <div className="chart-tooltip-total">
          <span className="chart-tooltip-total-label">Total</span>
          <span className="chart-tooltip-total-value">{formatValue(total)}</span>
        </div>
      </div>
    )
  }

  // Custom legend
  const CustomLegend = () => (
    <div className="chart-legend chart-legend-horizontal">
      {data.datasets.map((dataset, i) => {
        const color = getColor(i, dataset.label)
        const isActive = activeDataset === null || activeDataset === dataset.label

        return (
          <button
            key={dataset.label}
            type="button"
            className="chart-legend-item"
            style={{ opacity: isActive ? 1 : 0.3 }}
            onMouseEnter={() => setActiveDataset(dataset.label)}
            onMouseLeave={() => setActiveDataset(null)}
          >
            <span 
              className="chart-legend-dot"
              style={{ backgroundColor: color }}
            />
            <span className="chart-legend-label">{dataset.label}</span>
          </button>
        )
      })}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <ResponsiveContainer width="100%" height={360}>
        <BarChart 
          data={chartData} 
          layout={data.horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 20, right: 24, left: 8, bottom: 20 }}
          onAnimationEnd={() => setIsAnimated(false)}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={palette.gridLine} 
            vertical={!data.horizontal}
            horizontal={data.horizontal}
          />
          {data.horizontal ? (
            <>
              <XAxis 
                type="number" 
                tick={{ fontSize: 11, fill: palette.textMuted }} 
                tickFormatter={formatValue}
                axisLine={{ stroke: palette.axisLine }}
                tickLine={{ stroke: palette.axisLine }}
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 11, fill: palette.textMuted }} 
                width={100}
                axisLine={{ stroke: palette.axisLine }}
                tickLine={false}
              />
            </>
          ) : (
            <>
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11, fill: palette.textMuted }}
                axisLine={{ stroke: palette.axisLine }}
                tickLine={{ stroke: palette.axisLine }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: palette.textMuted }} 
                tickFormatter={formatValue}
                axisLine={{ stroke: palette.axisLine }}
                tickLine={false}
              />
            </>
          )}
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
          {data.datasets.map((dataset, i) => {
            const color = getColor(i, dataset.label)
            const isActive = activeDataset === null || activeDataset === dataset.label
            const isLast = i === data.datasets.length - 1

            return (
              <Bar
                key={dataset.label}
                dataKey={dataset.label}
                stackId="stack"
                fill={color}
                opacity={isActive ? 1 : 0.3}
                radius={isLast && !data.horizontal ? [4, 4, 0, 0] : 0}
                animationDuration={800}
                animationBegin={i * 100}
              >
                {data.showLabels && isLast && chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} />
                ))}
                {data.showLabels && isLast && (
                  <LabelList 
                    dataKey="total" 
                    position={data.horizontal ? 'right' : 'top'}
                    formatter={formatValue}
                    style={{ fontSize: 11, fill: palette.textMuted }}
                  />
                )}
              </Bar>
            )
          })}
        </BarChart>
      </ResponsiveContainer>
      <CustomLegend />
    </motion.div>
  )
}
